import json
import threading
import logging
import requests
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db import connection
from ..models import Paziente, NotaDiario
from .auth_views import token_required  # <-- Il tuo decoratore

# --- IMPORTAZIONE DELLE COSTANTI ---
from .constants import (
    OLLAMA_BASE_URL, 
    OLLAMA_MODEL, 
    LUNGHEZZA_NOTA_LUNGA, 
    LUNGHEZZA_NOTA_BREVE,
    KEYWORDS_SUICIDIO, 
    KEYWORDS_VIOLENZA_STALKING, 
    KEYWORDS_AUTOLESIONISMO,
    MESSAGGI_CONFORTO, 
    EMOZIONI_EMOJI, 
    CONTESTI_EMOJI
)

logger = logging.getLogger(__name__)


# --- FUNZIONI HELPER PER IL CONTESTO E I PROMPT ---

def _recupera_contesto_note_precedenti(paziente, limite=5, escludi_nota_id=None):
    """
    Recupera le ultime note del paziente per fornire contesto, gestendo correttamente i fusi orari.
    """
    # Filtra le note del paziente
    query = NotaDiario.objects.filter(paz=paziente)

    # Escludi la nota corrente se specificata e filtra solo note PRECEDENTI
    if escludi_nota_id is not None:
        try:
            nota_corrente = NotaDiario.objects.get(id=escludi_nota_id)
            query = query.filter(data_nota__lt=nota_corrente.data_nota)
        except NotaDiario.DoesNotExist:
            query = query.exclude(id=escludi_nota_id)

    # Prendi le ultime 'limite' note
    note_precedenti = query.order_by('-data_nota')[:limite]

    if not note_precedenti.exists():
        return "Nessuna nota precedente disponibile."

    contesto = []
    # Invertiamo per avere ordine cronologico (dalla più vecchia alla più recente)
    for nota in reversed(list(note_precedenti)):
        dt = nota.data_nota
        
        # --- CORREZIONE TZ ---
        if dt:
            if timezone.is_aware(dt):
                data_locale = timezone.localtime(dt)
            else:
                data_locale = timezone.make_aware(dt)
            data_ora_formattata = data_locale.strftime('%d/%m/%Y alle %H:%M')
        else:
            data_ora_formattata = "Data non disponibile"
            
        emozione = nota.emozione_predominante or "non specificata"
        testo_breve = nota.testo_paziente[:150] + "..." if len(nota.testo_paziente) > 150 else nota.testo_paziente
        contesto.append(f"[{data_ora_formattata}] - Emozione: {emozione}\nTesto: {testo_breve}")

    return "\n\n".join(contesto)

def _genera_prompt_strutturato_breve(testo, parametri_strutturati, tipo_parametri, max_chars, contesto_precedente, paziente=None):
    """Prompt per nota strutturata breve"""
    info_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        info_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
        L'autore di questo testo è {nome_completo}.
        Questo testo è scritto in prima persona da {nome_completo}.
        Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON al paziente.
        
        """

    # Sezione contesto note precedenti (solo se esistono)
    ha_note_precedenti = contesto_precedente != "Nessuna nota precedente disponibile."
    sezione_contesto = ""
    regole_note_precedenti = ""

    if ha_note_precedenti:
        sezione_contesto = f"""CONTESTO - Note precedenti del paziente (SOLO per riferimento, NON descrivere ogni nota):
            {contesto_precedente}
            """
        regole_note_precedenti = """
            2. Le note precedenti sono SOLO contesto di supporto (10%) - NON descriverle una per una
            3. Puoi fare riferimenti generici tipo "rispetto alle note precedenti", "in continuità con pattern emersi in precedenza"
            4. Se menzioni una nota specifica, USA SOLO la data e l'orario (es: "come emerso il 15/12/2025 alle 14:30")
            5. VIETATO ASSOLUTO: MAI scrivere "Nota 1", "Nota 2", "Nota 3", "(Nota 2)" o simili - il medico non sa cosa significano
            6. NON elencare o riassumere ogni singola nota precedente"""
    else:
        regole_note_precedenti = """
            2. Questa è la PRIMA nota del paziente - NON fare riferimenti a note precedenti inesistenti"""

    return f"""Sei un assistente per uno psicoterapeuta. Analizza il seguente testo e fornisci una valutazione clinica strutturata e CONCISA.

    {info_paziente}{sezione_contesto}
    Esempio:
    Testo: "Oggi ho fallito il mio esame e ho voglia di arrendermi."
    Risposta:
    {parametri_strutturati}
    
    Parametri da utilizzare:
    {tipo_parametri}
    
    ISTRUZIONI FONDAMENTALI:
    - La risposta deve essere BREVE e SINTETICA (massimo {max_chars} caratteri)
    - FORMATO OBBLIGATORIO: ogni parametro deve essere su una NUOVA RIGA nel formato "NomeParametro: valore"
    - Vai a capo dopo ogni parametro
    
    REGOLE PER L'ANALISI:
    1. CONCENTRATI AL 90% SULLA NOTA CORRENTE - analizza principalmente il testo attuale {regole_note_precedenti}
    
    COSA FARE:
    ✓ Analizzare gli aspetti emotivi, cognitivi e comportamentali della NOTA CORRENTE
    ✓ Notare eventuali cambiamenti o pattern rispetto al passato (in modo generico)
    ✓ Focalizzarsi su ciò che emerge OGGI nel testo
    
    COSA NON FARE:
    ✗ NON usare markdown, elenchi puntati o simboli
    ✗ NON usare frasi introduttive come "Ecco la nota clinica", "Ecco l'analisi"
    
    Completa sempre la frase, non troncare mai a metà. Inizia DIRETTAMENTE con il primo parametro.
    
    Ora analizza questo testo (FOCALIZZATI SU QUESTO):
    {testo}"""

def _genera_prompt_strutturato_lungo(testo, parametri_strutturati, tipo_parametri, max_chars, contesto_precedente, paziente=None):
    """Prompt per nota strutturata lunga"""
    info_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        info_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
            L'autore di questo testo è {nome_completo}.
            Questo testo è scritto in prima persona da {nome_completo}.
            Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON al paziente.
            
            """

    # Sezione contesto note precedenti (solo se esistono)
    ha_note_precedenti = contesto_precedente != "Nessuna nota precedente disponibile."
    sezione_contesto = ""
    regole_note_precedenti = ""

    if ha_note_precedenti:
        sezione_contesto = f"""CONTESTO - Note precedenti del paziente (SOLO per riferimento, NON descrivere ogni nota):
            {contesto_precedente}
            """
        regole_note_precedenti = """
            2. Le note precedenti sono SOLO contesto di supporto (20%) - NON descriverle una per una
            3. Puoi fare riferimenti come 'Si nota un miglioramento rispetto al pattern ansioso emerso nelle settimane precedenti'
            4. Se menzioni una nota specifica, USA SOLO la data e l'orario (es: 'diversamente da quanto emerso il 15/12/2025 alle 14:30')
            5. VIETATO ASSOLUTO: MAI scrivere 'Nota 1', 'Nota 2', 'Nota 3', '(Nota 2)' o simili - il medico non sa cosa significano
            6. NON elencare o riassumere ogni singola nota precedente
            7. Puoi usare espressioni generiche come 'nelle note precedenti', 'in passato', 'rispetto a situazioni simili'"""
    else:
        regole_note_precedenti = """
            2. Questa è la PRIMA nota del paziente - NON fare riferimenti a note precedenti inesistenti"""

    return f"""Sei un assistente per uno psicoterapeuta. Analizza il seguente testo e fornisci una valutazione clinica strutturata e DETTAGLIATA.

    {info_paziente}{sezione_contesto}
    Esempio:
    Testo: "Oggi ho fallito il mio esame e ho voglia di arrendermi."
    Risposta:
    {parametri_strutturati}
    
    Parametri da utilizzare:
    {tipo_parametri}
    
    ISTRUZIONI FONDAMENTALI:
    - La risposta deve essere DETTAGLIATA e APPROFONDITA (massimo {max_chars} caratteri)
    - FORMATO OBBLIGATORIO: ogni parametro deve essere su una NUOVA RIGA nel formato "NomeParametro: valore"
    - Vai a capo dopo ogni parametro
    - Fornisci analisi complete per ogni parametro
    
    REGOLE PER L'ANALISI:
    1. CONCENTRATI AL 80% SULLA NOTA CORRENTE - analizza principalmente il testo attuale in profondità {regole_note_precedenti}
    
    COSA FARE:
    ✓ Analizzare in profondità la NOTA CORRENTE: emozioni, pensieri, comportamenti
    ✓ Identificare schemi cognitivi e pattern comportamentali visibili OGGI
    ✓ Notare progressi o regressioni rispetto al contesto generale passato
    ✓ Fornire osservazioni cliniche dettagliate sulla situazione ATTUALE
    
    COSA NON FARE:
    ✗ NON usare markdown, elenchi puntati o simboli
    ✗ NON usare frasi introduttive come "Ecco la nota clinica"
    
    Completa sempre la frase, non troncare mai a metà. Inizia DIRETTAMENTE con il primo parametro.
    
    Ora analizza questo testo in profondità (QUESTO È IL FOCUS PRINCIPALE):
    {testo}"""


def _genera_prompt_non_strutturato_breve(testo, max_chars, contesto_precedente, paziente=None):
    """Prompt per nota non strutturata breve"""
    info_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        info_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
            L'autore di questo testo è {nome_completo}.
            Questo testo è scritto in prima persona da {nome_completo}.
            Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON al paziente.
            
            """

    # Sezione contesto note precedenti (solo se esistono)
    ha_note_precedenti = contesto_precedente != "Nessuna nota precedente disponibile."
    sezione_contesto = ""
    regole_note_precedenti = ""

    if ha_note_precedenti:
        sezione_contesto = f"""CONTESTO - Note precedenti del paziente (SOLO per riferimento, NON descrivere ogni nota):
            {contesto_precedente}
            """
        regole_note_precedenti = """
            2. Le note precedenti sono SOLO contesto (10%) - menzionale brevemente se utile
            3. Usa espressioni generiche come "rispetto alle note precedenti", "diversamente da prima"
            4. Se menzioni una nota specifica, USA SOLO la data e l'orario (es: "rispetto al 15/12/2025 alle 14:30")
            5. VIETATO ASSOLUTO: MAI scrivere "Nota 1", "Nota 2", "(Nota 3)" o simili - il medico non sa cosa significano
            6. NON dedicare frasi intere a riassumere le note precedenti"""
    else:
        regole_note_precedenti = """
            2. Questa è la PRIMA nota del paziente - NON fare riferimenti a note precedenti inesistenti"""

    return f"""Sei un assistente di uno psicoterapeuta specializzato. Analizza il seguente testo e fornisci una valutazione clinica discorsiva BREVE.

    {info_paziente}{sezione_contesto}
    ISTRUZIONI FONDAMENTALI:
    - La risposta deve essere BREVE e SINTETICA (massimo {max_chars} caratteri)
    - Scrivi in modo discorsivo, come un commento clinico professionale
    - NON usare elenchi, grassetti, markdown, simboli o titoli
    
    REGOLE PER L'ANALISI:
    1. CONCENTRATI AL 90% SULLA NOTA CORRENTE - analizza principalmente il testo attuale {regole_note_precedenti}
    
    COSA FARE:
    ✓ Analizzare il contenuto emotivo e psicologico della NOTA CORRENTE
    ✓ Identificare i vissuti emotivi emergenti OGGI
    ✓ Notare eventuali cambiamenti generali rispetto al passato
    ✓ Scrivere in modo fluido e professionale
    
    COSA NON FARE:
    ✗ NON usare frasi introduttive come "Ecco la nota clinica", "La valutazione è"
    
    Inizia DIRETTAMENTE con l'analisi del contenuto emotivo/psicologico. Completa sempre la frase.
    
    Testo da analizzare (QUESTO È IL FOCUS):
    {testo}"""


def _genera_prompt_non_strutturato_lungo(testo, max_chars, contesto_precedente, paziente=None):
    """Prompt per nota non strutturata lunga"""
    info_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        info_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
            L'autore di questo testo è {nome_completo}.
            Questo testo è scritto in prima persona da {nome_completo}.
            Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON al paziente.
            
            """

    # Sezione contesto note precedenti (solo se esistono)
    ha_note_precedenti = contesto_precedente != "Nessuna nota precedente disponibile."
    sezione_contesto = ""
    regole_note_precedenti = ""

    if ha_note_precedenti:
        sezione_contesto = f"""CONTESTO - Note precedenti del paziente (SOLO per riferimento, NON descrivere ogni nota):
            {contesto_precedente}
            """
        regole_note_precedenti = """
            2. Le note precedenti sono SOLO contesto di supporto (20%) - NON descriverle una per una
            3. Puoi fare riferimenti come 'Si osserva un evoluzione rispetto al pattern precedente', 'Diversamente dalle situazioni passate'
            4. Se menzioni una nota specifica, USA SOLO la data e l'orario (es: 'come emerso il 15/12/2025 alle 14:30')
            5. VIETATO ASSOLUTO: MAI scrivere 'Nota 1', 'Nota 2', '(Nota 3)' o simili - il medico non sa cosa significano
            6. NON dedicare paragrafi interi a riassumere le note precedenti
            7. Puoi usare espressioni generiche come 'nelle note precedenti', 'in passato', 'rispetto a situazioni simili'"""
    else:
        regole_note_precedenti = """
            2. Questa è la PRIMA nota del paziente - NON fare riferimenti a note precedenti inesistenti"""

    return f"""Sei un assistente di uno psicoterapeuta specializzato. Analizza il seguente testo e fornisci una valutazione clinica discorsiva DETTAGLIATA e APPROFONDITA.

    {info_paziente}{sezione_contesto}
    ISTRUZIONI FONDAMENTALI:
    - La risposta deve essere DETTAGLIATA e COMPLETA (massimo {max_chars} caratteri)
    - Scrivi in modo discorsivo e professionale, come una nota clinica narrativa
    - Approfondisci gli aspetti emotivi, cognitivi e comportamentali
    - NON usare elenchi, grassetti, markdown, simboli o titoli
    
    REGOLE PER L'ANALISI:
    1. CONCENTRATI AL 80% SULLA NOTA CORRENTE - analizza in profondità il testo attuale {regole_note_precedenti}
    
    COSA FARE:
    ✓ Analizzare in profondità il contenuto emotivo della NOTA CORRENTE
    ✓ Esplorare i meccanismi cognitivi e i pattern comportamentali visibili OGGI
    ✓ Identificare i vissuti emotivi, le difese psicologiche, gli schemi ricorrenti nella situazione ATTUALE
    ✓ Contestualizzare in modo generico rispetto all'evoluzione del paziente
    ✓ Scrivere in modo fluido, professionale e clinicamente accurato
    
    COSA NON FARE:
    ✗ NON usare frasi introduttive come "Ecco la nota clinica", "La valutazione è"
    
    Inizia DIRETTAMENTE con l'analisi del contenuto emotivo/psicologico ATTUALE. Completa sempre la frase.
    
    Testo da analizzare in profondità (QUESTO È IL FOCUS PRINCIPALE):
    {testo}"""

# ------------------------------------------------------------------------

# --- FUNZIONI DI IA E ANALISI ---

def genera_con_ollama(prompt, max_chars=None, temperature=0.7):
    """
    Funzione helper per chiamare Ollama API e normalizzare la risposta rimuovendo
    eventuali prefissi o etichette introduttive (es. "Risposta:", "La tua risposta:").
    """
    try:
        estimated_tokens = (max_chars * 2) if max_chars else 500

        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": estimated_tokens,
            }
        }

        response = requests.post(OLLAMA_BASE_URL, json=payload, timeout=500)

        if response.status_code != 200:
            logger.error(f"Ollama ha restituito status code {response.status_code}")
            logger.error(f"Risposta: {response.text}")
            return "Il servizio di generazione testo non è al momento disponibile. Riprova più tardi."

        response.raise_for_status()
        result = response.json()

        text = ''
        if isinstance(result, dict):
            for key in ('response', 'text', 'output', 'result'):
                if key in result and result[key]:
                    text = result[key]
                    break
        else:
            text = result

        if isinstance(text, list):
            text = " ".join(map(str, text))

        text = str(text or '').strip()

        # Rimuove prefissi introduttivi comuni (case-insensitive)
        text = re.sub(
            r'^\s*(?:La tua risposta[:\-\s]*|Risposta[:\-\s]*|Output[:\-\s]*|>\s*|Answer[:\-\s]*|Risposta del modello[:\-\s]*)+',
            '', text, flags=re.I
        )

        # Rimuove frasi introduttive tipiche delle note cliniche
        text = re.sub(
            r'^\s*(?:Ecco la (?:nota clinica|valutazione|analisi)[:\-\s]*|Di seguito[:\-\s]*|La valutazione è[:\-\s]*|Ecco l\'analisi[:\-\s]*|Nota clinica[:\-\s]*)+',
            '', text, flags=re.I
        )

        text = re.sub(r'^[\'"«\s\-\u2022>]+', '', text).strip()

        return text if text else "Generazione non disponibile al momento."

    except requests.exceptions.ConnectionError:
        logger.error("Impossibile connettersi a Ollama. Assicurati che il servizio sia in esecuzione.")
        return "Servizio di generazione testo non disponibile. Verifica che Ollama sia attivo."
    except requests.exceptions.Timeout:
        logger.error("Timeout nella chiamata a Ollama")
        return "Il tempo di attesa per la generazione è scaduto. Riprova."
    except requests.exceptions.RequestException as e:
        logger.error(f"Errore nella chiamata a Ollama: {e}")
        return "Errore durante la generazione del testo. Riprova più tardi."
    except Exception as e:
        logger.error(f"Errore imprevisto: {e}")
        return "Errore imprevisto durante la generazione. Riprova."


def rileva_contenuto_crisi(testo):
    if not testo:
        return False, 'none'

    testo_lower = testo.lower()

    for keyword in KEYWORDS_SUICIDIO:
        if keyword in testo_lower:
            logger.warning(f"EMERGENZA RILEVATA - Tipo: suicidio - Keyword: {keyword}")
            return True, 'suicidio'

    for keyword in KEYWORDS_VIOLENZA_STALKING:
        if keyword in testo_lower:
            logger.warning(f"EMERGENZA RILEVATA - Tipo: violenza - Keyword: {keyword}")
            return True, 'violenza'

    for keyword in KEYWORDS_AUTOLESIONISMO:
        if keyword in testo_lower:
            logger.warning(f"EMERGENZA RILEVATA - Tipo: autolesionismo - Keyword: {keyword}")
            return True, 'autolesionismo'

    return False, 'none'


def genera_messaggio_emergenza(tipo_emergenza, medico):
    if tipo_emergenza not in MESSAGGI_CONFORTO:
        return None

    nome_medico = f"Dr. {medico.nome} {medico.cognome}" if medico else "il tuo medico"

    if medico and medico.numero_telefono_cellulare:
        telefono_medico = medico.numero_telefono_cellulare
    elif medico and medico.numero_telefono_studio:
        telefono_medico = medico.numero_telefono_studio
    else:
        telefono_medico = "(contattalo via email)"

    messaggio = MESSAGGI_CONFORTO[tipo_emergenza].format(
        nome_medico=nome_medico,
        telefono_medico=telefono_medico
    )
    return messaggio


def genera_frasi_di_supporto(testo, paziente=None):
    print("Generazione frasi supporto con Ollama")
    contesto_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        contesto_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
        L'autore di questo testo è {nome_completo}.
        Questo testo è scritto in prima persona da {nome_completo}.
        Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON all'autore.
        Quando rispondi, rivolgiti direttamente a {paziente.nome} (o usa "tu" senza nominarlo).
        
        """

    prompt = f"""Sei un assistente empatico e di supporto emotivo. Il tuo compito è rispondere con calore e comprensione a persone che stanno attraversando momenti difficili.

    {contesto_paziente}Esempio:
    Testo del paziente: "Ho fallito il mio esame e ho voglia di arrendermi."
    Risposta di supporto: "Mi dispiace molto per il tuo esame. È normale sentirsi delusi, ma questo non definisce il tuo valore come persona. Potresti provare a rivedere il tuo metodo di studio e chiedere aiuto se ne hai bisogno. Ce la puoi fare!"
    
    ISTRUZIONI:
    - Rispondi in italiano con tono caldo, empatico e incoraggiante
    - Riconosci e valida le emozioni espresse
    - Offri una prospettiva positiva senza minimizzare i sentimenti
    - Suggerisci delicatamente possibili strategie o riflessioni utili
    - Non usare un tono clinico o distaccato
    - Completa sempre la risposta, non troncare mai a metà
    - NON confondere l'autore del testo con altre persone menzionate nella nota
    
    Testo del paziente:
    {testo}
    
    Rispondi con una frase di supporto:"""

    return genera_con_ollama(prompt, max_chars=500, temperature=0.3)


def genera_frasi_cliniche(testo, medico, paziente, nota_id=None):
    """
    Genera note cliniche personalizzate in base alle preferenze del medico.
    Include il contesto delle ultime 5 note del paziente.
    """
    print("Generazione commenti clinici con Ollama")

    try:
        tipo_nota = medico.tipo_nota  # True per "strutturato", False per "non strutturato"
        lunghezza_nota = medico.lunghezza_nota  # True per "lungo", False per "breve"
        tipo_parametri = medico.tipo_parametri.split(".:;!") if medico.tipo_parametri else []
        testo_parametri = medico.testo_parametri.split(".:;!") if medico.testo_parametri else []

        max_chars = LUNGHEZZA_NOTA_LUNGA if lunghezza_nota else LUNGHEZZA_NOTA_BREVE

        contesto_precedente = _recupera_contesto_note_precedenti(paziente, limite=5, escludi_nota_id=nota_id)

        if tipo_nota:
            parametri_strutturati = "\n".join(
                [f"{tipo}: {txt}" for tipo, txt in zip(tipo_parametri, testo_parametri)]
            )
            if lunghezza_nota:
                prompt = _genera_prompt_strutturato_lungo(testo, parametri_strutturati, tipo_parametri, max_chars, contesto_precedente, paziente)
            else:
                prompt = _genera_prompt_strutturato_breve(testo, parametri_strutturati, tipo_parametri, max_chars, contesto_precedente, paziente)
        else:
            if lunghezza_nota:
                prompt = _genera_prompt_non_strutturato_lungo(testo, max_chars, contesto_precedente, paziente)
            else:
                prompt = _genera_prompt_non_strutturato_breve(testo, max_chars, contesto_precedente, paziente)

        return genera_con_ollama(prompt, max_chars=max_chars, temperature=0.6)

    except Exception as e:
        logger.error(f"Errore nella generazione clinica: {e}")
        return f"Errore durante la generazione: {e}"


def analizza_sentiment(testo, paziente=None):
    """
    Analizza il sentiment del testo del paziente e restituisce l'emozione predominante
    con relativa spiegazione.
    """
    print("Analisi sentiment con Ollama")

    emozioni_lista = ', '.join(EMOZIONI_EMOJI.keys())

    info_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        info_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
    L'autore di questo testo è {nome_completo}.
    Questo testo è scritto in prima persona da {nome_completo}.
    Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON all'autore.
    Analizza le emozioni di {nome_completo}, l'autore del testo.
    
    """

    prompt = f"""Sei un esperto di analisi delle emozioni. Il tuo compito è identificare l'emozione predominante in un testo e spiegare perché.

    {info_paziente}EMOZIONI DISPONIBILI (scegli SOLO tra queste):
    {emozioni_lista}
    
    FORMATO RISPOSTA (OBBLIGATORIO):
    Emozione: [una sola parola dalla lista]
    Spiegazione: [breve spiegazione di 1-2 frasi che cita elementi specifici del testo]
    
    REGOLE FONDAMENTALI:
    1. La prima riga DEVE iniziare con "Emozione:" seguita da UNA SOLA PAROLA dalla lista
    2. La seconda riga DEVE iniziare con "Spiegazione:" seguita dalla motivazione
    3. Nella spiegazione, DEVI citare parole o frasi SPECIFICHE del testo originale tra virgolette
    4. La spiegazione deve essere breve (max 2 frasi)
    5. NON inventare emozioni non presenti nella lista
    6. USA "confusione" SOLO se il testo esprime esplicitamente incertezza, dubbi o disorientamento
    7. La spiegazione DEVE SEMPRE contenere citazioni dirette dal testo
    
    ATTENZIONE SU "CONFUSIONE":
    - "confusione" significa disorientamento mentale, non sapere cosa fare o pensare
    - NON usare "confusione" come emozione di default quando non sai cosa scegliere
    - Se il testo esprime più emozioni, scegli quella PREDOMINANTE (la più forte/evidente)
    - Se il testo è neutro o descrittivo, cerca comunque il tono emotivo sottostante
    
    ESEMPI CORRETTI:
    Testo: "Oggi sono riuscito a superare l'esame, sono contentissimo e felice!"
    Emozione: felicità
    Spiegazione: Il testo esprime felicità attraverso le parole "contentissimo" e "felice", associate al successo nell'esame.
    
    Testo: "Mi sento solo e nessuno mi capisce, è terribile"
    Emozione: solitudine
    Spiegazione: L'espressione "mi sento solo" e "nessuno mi capisce" indica un vissuto di isolamento emotivo.
    
    Testo: "Non ce la faccio più, tutto va storto e sono stufo"
    Emozione: frustrazione
    Spiegazione: Le frasi "non ce la faccio più" e "tutto va storto" indicano un senso di impotenza e irritazione.
    
    Testo: "Non so cosa fare, sono indeciso se accettare o rifiutare"
    Emozione: confusione
    Spiegazione: Le espressioni "non so cosa fare" e "sono indeciso" indicano uno stato di incertezza e disorientamento decisionale.
    
    Testo da analizzare:
    {testo}
    
    Rispondi ora nel formato richiesto (ricorda: la spiegazione DEVE citare parole specifiche del testo):"""

    risposta = genera_con_ollama(prompt, max_chars=300, temperature=0.2)

    linee = risposta.strip().split('\n')
    emozione = None
    spiegazione = None
    in_spiegazione = False
    spiegazione_parts = []

    for linea in linee:
        linea_stripped = linea.strip()
        if linea_stripped.lower().startswith('emozione:'):
            emozione = linea_stripped.split(':', 1)[1].strip().lower().rstrip('.!?,;:')
            in_spiegazione = False
        elif linea_stripped.lower().startswith('spiegazione:'):
            spiegazione_parts.append(linea_stripped.split(':', 1)[1].strip())
            in_spiegazione = True
        elif in_spiegazione and linea_stripped:
            spiegazione_parts.append(linea_stripped)

    if spiegazione_parts:
        spiegazione = ' '.join(spiegazione_parts)

    if emozione and emozione in EMOZIONI_EMOJI:
        emozione_validata = emozione
    else:
        emozione_validata = None
        for chiave in EMOZIONI_EMOJI.keys():
            if emozione and chiave in emozione:
                emozione_validata = chiave
                break

        if not emozione_validata:
            sinonimi = {
                'contentezza': 'gioia', 'allegria': 'gioia', 'contento': 'gioia', 'felice': 'felicità',
                'triste': 'tristezza', 'arrabbiato': 'rabbia', 'furioso': 'rabbia', 'spaventato': 'paura',
                'impaurito': 'paura', 'ansioso': 'ansia', 'agitato': 'ansia', 'nervoso': 'nervosismo',
                'stanco': 'stanchezza', 'affaticato': 'stanchezza', 'angoscia': 'ansia', 'angosciato': 'ansia',
                'confuso': 'confusione', 'nostalgico': 'nostalgia', 'deluso': 'delusione', 'solo': 'solitudine',
                'isolato': 'solitudine', 'frustrato': 'frustrazione', 'orgoglioso': 'orgoglio', 
                'imbarazzato': 'imbarazzo', 'inadeguato': 'inadeguatezza', 'disperato': 'disperazione',
            }
            if emozione and emozione in sinonimi:
                emozione_validata = sinonimi[emozione]

        if not emozione_validata:
            print(f"⚠️ ATTENZIONE: Emozione non valida ricevuta dal modello: '{emozione}'") 
            emozione_validata = emozione if emozione else None

    if not spiegazione or (spiegazione and len(spiegazione) < 10):
        if 'perché' in risposta.lower() or 'indica' in risposta.lower() or 'esprime' in risposta.lower():
            spiegazione = risposta.replace('\n', ' ').strip()
            if 'emozione:' in spiegazione.lower():
                parti = spiegazione.lower().split('spiegazione:')
                if len(parti) > 1:
                    spiegazione = parti[1].strip()
        else:
            if emozione_validata:
                spiegazione = f"Il testo esprime un vissuto emotivo riconducibile a {emozione_validata}."
            else:
                spiegazione = "Analisi emotiva del testo in corso."

    print(f"Emozione rilevata: {emozione_validata}, Spiegazione: {spiegazione}")
    return emozione_validata, spiegazione


def analizza_contesto_sociale(testo, paziente=None):
    """
    Analizza il contesto sociale del testo del paziente e restituisce il contesto principale
    con relativa spiegazione.
    """
    print("Analisi contesto sociale con Ollama")

    contesti_lista = ', '.join(CONTESTI_EMOJI.keys())

    info_paziente = ""
    if paziente:
        nome_completo = f"{paziente.nome} {paziente.cognome}"
        info_paziente = f"""INFORMAZIONE IMPORTANTE SULL'AUTORE:
        L'autore di questo testo è {nome_completo}.
        Questo testo è scritto in prima persona da {nome_completo}.
        Qualsiasi altro nome menzionato (anche se uguale a "{paziente.nome}") si riferisce ad altre persone (amici, familiari, colleghi, ecc.), NON all'autore.
        Identifica il contesto sociale in cui si trova {nome_completo}, l'autore del testo.
        
        """

    prompt = f"""Sei un esperto di analisi del contesto sociale. Il tuo compito è identificare il contesto sociale principale in cui si svolge il racconto di un paziente e spiegare perché.

    {info_paziente}CONTESTI DISPONIBILI (scegli SOLO tra questi):
    {contesti_lista}
    
    FORMATO RISPOSTA (OBBLIGATORIO):
    Contesto: [una sola parola o due parole dalla lista]
    Spiegazione: [breve spiegazione di 1-2 frasi che cita elementi specifici del testo]
    
    REGOLE FONDAMENTALI:
    1. La prima riga DEVE iniziare con "Contesto:" seguita da UNA o DUE PAROLE dalla lista
    2. La seconda riga DEVE iniziare con "Spiegazione:" seguita dalla motivazione
    3. Nella spiegazione, cita parole o frasi SPECIFICHE del testo originale
    4. La spiegazione deve essere breve (max 2 frasi)
    5. NON inventare contesti non presenti nella lista
    6. Se il testo non indica chiaramente un contesto, usa "altro"
    
    REGOLE SPECIFICHE IMPORTANTI:
    - L'attività fisica (palestra, allenamento, corsa, nuoto, calcio, fitness, yoga, esercizi, pesi, cardio, crossfit, ecc.) va SEMPRE classificata come "palestra" o "sport", MAI come "tempo libero"
    - "tempo libero" si usa solo per attività ricreative NON sportive come: videogiochi, TV, cinema, lettura, uscite con amici per svago, shopping, ecc.
    
    COME DISTINGUERE I CONTESTI RELAZIONALI (MOLTO IMPORTANTE):
    - "famiglia": usa SOLO se il testo menziona ESPLICITAMENTE familiari (madre, padre, fratello, sorella, figlio, figlia, marito, moglie, nonno, nonna, zio, zia, cugino, ecc.)
    - "relazione": usa quando il testo parla di partner sentimentale/romantico (fidanzato/a, compagno/a, relazione amorosa, baci, intimità, sentimenti romantici, paura di investire in una relazione, gelosia sentimentale)
    - "amicizia": usa per amici, compagni, conoscenti (senza connotazione romantica)
    - Se una persona viene descritta con dinamiche romantiche/sentimentali (es. "investire su qualcuno", "gelosia", "amore", gesti affettuosi romantici) = "relazione"
    - NON assumere che qualcuno sia un familiare solo perché è una persona cara
    
    ESEMPI CORRETTI:
    Testo: "Oggi al lavoro il mio capo mi ha criticato davanti a tutti i colleghi"
    Contesto: lavoro
    Spiegazione: Il testo si svolge chiaramente in ambito lavorativo, con riferimenti espliciti al "lavoro", al "capo" e ai "colleghi".
    
    Testo: "Ho litigato con mia madre perché non capisce le mie scelte"
    Contesto: famiglia
    Spiegazione: Il testo descrive una dinamica familiare, con riferimento esplicito a "mia madre" e a un conflitto intergenerazionale.
    
    Testo: "Ho passato la serata con Marco e abbiamo giocato alla PlayStation"
    Contesto: amicizia
    Spiegazione: Il testo descrive un momento di svago con un amico, senza connotazioni romantiche o familiari.
    
    Testo: "Ieri sera io e Laura ci siamo baciati per la prima volta, il mio cuore batteva fortissimo"
    Contesto: relazione
    Spiegazione: Il testo descrive chiaramente un momento romantico e sentimentale con "bacio" e riferimenti a sentimenti d'amore.
    
    Testo: "Sono andato in palestra e mi sono allenato duramente"
    Contesto: palestra
    Spiegazione: Il testo menziona esplicitamente la "palestra" e l'allenamento fisico.
    
    Testo: "Oggi ho fatto una bella corsa al parco e poi esercizi a casa"
    Contesto: sport
    Spiegazione: Il testo descrive attività fisica come "corsa" ed "esercizi", che rientrano nel contesto sportivo.
    
    Testo da analizzare:
    {testo}
    
    Rispondi ora nel formato richiesto:"""

    risposta = genera_con_ollama(prompt, max_chars=400, temperature=0.2)

    print(f"Risposta contesto sociale raw: {risposta}")

    linee = risposta.strip().split('\n')
    contesto = None
    spiegazione = None

    for linea in linee:
        linea_stripped = linea.strip()
        if linea_stripped.lower().startswith('contesto:'):
            contesto = linea_stripped.split(':', 1)[1].strip().lower().rstrip('.!?,;:')
        elif linea_stripped.lower().startswith('spiegazione:'):
            spiegazione = linea_stripped.split(':', 1)[1].strip()

    print(f"Contesto parsed: {contesto}, Spiegazione parsed: {spiegazione}")

    if contesto and contesto in CONTESTI_EMOJI:
        contesto_validato = contesto
    else:
        contesto_validato = 'altro'
        for chiave in CONTESTI_EMOJI.keys():
            if contesto and chiave in contesto:
                contesto_validato = chiave
                break

        sinonimi = {
            'ufficio': 'lavoro', 'azienda': 'lavoro', 'professione': 'lavoro', 'carriera': 'lavoro',
            'college': 'università', 'ateneo': 'università', 'liceo': 'scuola', 'elementare': 'scuola',
            'media': 'scuola', 'genitori': 'famiglia', 'fratelli': 'famiglia', 'parenti': 'famiglia',
            'figli': 'famiglia', 'madre': 'famiglia', 'padre': 'famiglia', 'mamma': 'famiglia',
            'papà': 'famiglia', 'sorella': 'famiglia', 'fratello': 'famiglia', 'amici': 'amicizia',
            'compagni': 'amicizia', 'amico': 'amicizia', 'amica': 'amicizia', 'partner': 'relazione',
            'fidanzato': 'relazione', 'fidanzata': 'relazione', 'marito': 'relazione', 'moglie': 'relazione',
            'compagno': 'relazione', 'compagna': 'relazione', 'ragazzo': 'relazione', 'ragazza': 'relazione',
            'sentimentale': 'relazione', 'romantico': 'relazione', 'romantica': 'relazione', 'coppia': 'relazione',
            'amore': 'relazione', 'innamorato': 'relazione', 'innamorata': 'relazione', 'medico': 'salute',
            'ospedale': 'salute', 'malattia': 'salute', 'allenamento': 'palestra', 'allenarsi': 'palestra',
            'corsa': 'sport', 'correre': 'sport', 'nuoto': 'sport', 'nuotare': 'sport', 'calcio': 'sport',
            'tennis': 'sport', 'basket': 'sport', 'pallavolo': 'sport', 'ciclismo': 'sport', 'bicicletta': 'sport',
            'fitness': 'palestra', 'pesi': 'palestra', 'cardio': 'palestra', 'crossfit': 'palestra', 'yoga': 'palestra',
            'pilates': 'palestra', 'esercizi': 'palestra', 'esercizio': 'palestra', 'attività fisica': 'sport',
            'ginnastica': 'palestra', 'svago': 'tempo libero', 'divertimento': 'tempo libero', 'passatempo': 'hobby',
            'vacanza': 'viaggi', 'viaggio': 'viaggi', 'appartamento': 'casa', 'soldi': 'finanze', 'economia': 'finanze',
            'meditazione': 'spiritualità', 'religione': 'spiritualità', 'esame': 'studio', 'compiti': 'studio',
            'cibo': 'alimentazione', 'dieta': 'alimentazione', 'dormire': 'sonno', 'insonnia': 'sonno',
        }

        if contesto and contesto in sinonimi:
            contesto_validato = sinonimi[contesto]

    if not spiegazione:
        spiegazione = "Contesto rilevato in base al contenuto generale del testo."

    print(f"Contesto rilevato: {contesto_validato}, Spiegazione: {spiegazione}")
    return contesto_validato, spiegazione


def genera_analisi_in_background(nota_id, testo_paziente, medico, paziente):
    try:
        testo_clinico = genera_frasi_cliniche(testo_paziente, medico, paziente, nota_id=nota_id)
        emozione_predominante, spiegazione_emozione = analizza_sentiment(testo_paziente, paziente)
        contesto_sociale, spiegazione_contesto = analizza_contesto_sociale(testo_paziente, paziente)

        nota = NotaDiario.objects.get(id=nota_id)
        nota.testo_clinico = testo_clinico
        nota.emozione_predominante = emozione_predominante
        nota.spiegazione_emozione = spiegazione_emozione
        nota.contesto_sociale = contesto_sociale
        nota.spiegazione_contesto = spiegazione_contesto
        nota.generazione_in_corso = False
        nota.save()

        logger.info(f"Generazione in background completata per nota {nota_id}")
    except Exception as e:
        logger.error(f"Errore nella generazione in background per nota {nota_id}: {e}")
        try:
            nota = NotaDiario.objects.get(id=nota_id)
            nota.generazione_in_corso = False
            nota.testo_clinico = "Errore durante la generazione dell'analisi clinica."
            nota.save()
        except:
            pass
    finally:
        connection.close()


# --- VISTA API PRINCIPALE ---

@csrf_exempt
@token_required 
def create_nota(request):
    if request.method != 'POST':
        return JsonResponse({"status": "error", "message": "Metodo non consentito"}, status=405)

    if getattr(request, 'user_type', None) != 'paziente':
        return JsonResponse({"status": "error", "message": "Accesso negato. Solo i pazienti possono creare note nel diario."}, status=403)

    try:
        paziente_id = request.user_id
        paziente = Paziente.objects.get(codice_fiscale=paziente_id)
        medico = paziente.med

        data = json.loads(request.body)
        testo_paziente = data.get('testo', '').strip()
        generate_response_flag = data.get('aiSupport', False)

        if not testo_paziente:
            return JsonResponse({"status": "error", "message": "Il testo della nota non può essere vuoto."}, status=400)

        testo_supporto = ""
        is_emergency, tipo_emergenza = rileva_contenuto_crisi(testo_paziente)
        messaggio_emergenza = None
        
        if is_emergency:
            messaggio_emergenza = genera_messaggio_emergenza(tipo_emergenza, medico)
        else:
            if generate_response_flag:
                testo_supporto = genera_frasi_di_supporto(testo_paziente, paziente)

        nota = NotaDiario.objects.create(
            paz=paziente,
            testo_paziente=testo_paziente,
            testo_supporto=testo_supporto,
            testo_clinico="",  
            data_nota=timezone.now(),
            is_emergency=is_emergency,
            tipo_emergenza=tipo_emergenza,
            messaggio_emergenza=messaggio_emergenza,
            generazione_in_corso=True
        )

        thread = threading.Thread(
            target=genera_analisi_in_background,
            args=(nota.id, testo_paziente, medico, paziente)
        )
        thread.daemon = True
        thread.start()

        return JsonResponse({
            "status": "success", 
            "message": "Nota salvata con successo", 
            "data": {"nota_id": nota.id}
        }, status=201)

    except Paziente.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Paziente non trovato nel sistema."}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Formato dati non valido (JSON atteso)."}, status=400)
    except Exception as e:
        logger.error(f"Errore nella creazione della nota: {str(e)}")
        return JsonResponse({"status": "error", "message": f"Errore interno del server: {str(e)}"}, status=500)
    


@csrf_exempt
@token_required 
def get_note(request):
    """
    Recupera l'elenco di tutte le note del paziente loggato, gestendo i fusi orari.
    """
    if request.method != 'GET':
        return JsonResponse({"status": "error", "message": "Metodo non consentito"}, status=405)

    if getattr(request, 'user_type', None) != 'paziente':
        return JsonResponse({"status": "error", "message": "Accesso negato."}, status=403)

    try:
        paziente_id = request.user_id
        paziente = Paziente.objects.get(codice_fiscale=paziente_id)

        # Recupera tutte le note ordinate dalla più recente
        note_db = NotaDiario.objects.filter(paz=paziente).order_by('-data_nota')

        note_list = []
        for nota in note_db:
            dt = nota.data_nota
            
            # --- CORREZIONE TZ ---
            if dt:
                if timezone.is_aware(dt):
                    data_locale = timezone.localtime(dt)
                else:
                    data_locale = timezone.make_aware(dt)
                data_iso = data_locale.isoformat()
            else:
                data_iso = None
            
            note_list.append({
                "id": nota.id,
                "testo": nota.testo_paziente,
                "data_iso": data_iso,
                "emozione": nota.emozione_predominante,
                "generazione_in_corso": nota.generazione_in_corso
            })

        return JsonResponse({
            "status": "success", 
            "data": note_list
        }, status=200)

    except Paziente.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Paziente non trovato."}, status=404)
    except Exception as e:
        logger.error(f"Errore nel recupero delle note: {str(e)}")
        return JsonResponse({"status": "error", "message": "Errore interno durante il recupero delle note."}, status=500)

@csrf_exempt
@token_required
def get_patient_info(request):
    """Restituisce le info personali del paziente loggato in modo sicuro"""
    if request.method != 'GET':
        return JsonResponse({"status": "error", "message": "Metodo non consentito"}, status=405)
    try:
        # Recupera il paziente usando l'ID dal token
        paziente = Paziente.objects.get(codice_fiscale=request.user_id)
        
        # Gestione sicura della data di nascita per evitare crash 500
        data_formattata = ""
        if paziente.data_di_nascita:
            data_formattata = paziente.data_di_nascita.strftime('%d/%m/%Y')

        return JsonResponse({
            "status": "success",
            "data": {
                "nome": paziente.nome,
                "cognome": paziente.cognome,
                "email": paziente.email,
                "data_nascita": data_formattata,
                "codice_fiscale": paziente.codice_fiscale
            }
        })
    except Paziente.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Paziente non trovato"}, status=404)
    except Exception as e:
        # Restituisce l'errore esatto per aiutarti nel debug
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
@token_required
def get_doctor_info(request):
    """Restituisce le info del medico associato al paziente loggato"""
    if request.method != 'GET':
        return JsonResponse({"status": "error", "message": "Metodo non consentito"}, status=405)
    try:
        paziente = Paziente.objects.get(codice_fiscale=request.user_id)
        medico = paziente.med # 'med' è il nome della ForeignKey nel tuo modello
        
        if not medico:
            return JsonResponse({"status": "error", "message": "Nessun medico associato al tuo profilo"}, status=404)
        
        return JsonResponse({
            "status": "success",
            "data": {
                "nome": f"Dott. {medico.nome} {medico.cognome}",
                "specializzazione": "Psicoterapeuta",
                "email": medico.email,
                "indirizzo": medico.indirizzo_studio,
                "telefono": medico.numero_telefono_studio,
                "cellulare": medico.numero_telefono_cellulare,
            }
        })
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
@csrf_exempt
@token_required
def get_note_details(request, pk):
    """Recupera i dettagli di una singola nota"""
    if request.method != 'GET':
        return JsonResponse({"status": "error", "message": "Metodo non consentito"}, status=405)
    
    try:
        paziente = Paziente.objects.get(codice_fiscale=request.user_id)
        nota = NotaDiario.objects.get(pk=pk, paz=paziente) # Sicurezza: solo note proprie
        
        # Formattazione data locale
        dt = nota.data_nota
        data_locale = timezone.localtime(dt) if timezone.is_aware(dt) else timezone.make_aware(dt)

        return JsonResponse({
            "status": "success",
            "data": {
                "id": nota.id,
                "data_formattata": data_locale.strftime('%A, %d %B %Y'),
                "ora": data_locale.strftime('%H:%M'),
                "testo_paziente": nota.testo_paziente,
                "testo_supporto": nota.testo_supporto,
                "emozione": nota.emozione_predominante,
                "spiegazione_emozione": nota.spiegazione_emozione,
                "contesto": nota.contesto_sociale,
                "spiegazione_contesto": nota.spiegazione_contesto,
                "generazione_in_corso": nota.generazione_in_corso
            }
        })
    except NotaDiario.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Nota non trovata"}, status=404)
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
@token_required
def delete_nota(request, pk):
    """Elimina una nota specifica"""
    if request.method != 'DELETE':
        return JsonResponse({"status": "error", "message": "Metodo non consentito"}, status=405)
    
    try:
        paziente = Paziente.objects.get(codice_fiscale=request.user_id)
        nota = NotaDiario.objects.get(pk=pk, paz=paziente)
        nota.delete()
        return JsonResponse({"status": "success", "message": "Nota eliminata"})
    except NotaDiario.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Nota non trovata"}, status=404)