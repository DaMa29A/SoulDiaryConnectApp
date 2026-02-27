OLLAMA_BASE_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.1:8b"  # Cambia in "cbt-assistant" se hai creato il modello personalizzato

# Configurazione lunghezza note cliniche (in caratteri)
LUNGHEZZA_NOTA_BREVE = 300
LUNGHEZZA_NOTA_LUNGA = 500


KEYWORDS_SUICIDIO = [
    'suicidio', 'suicidarmi', 'suicidarsi', 'uccidermi', 'uccidersi', 'farla finita',
    'togliermi la vita', 'non voglio più vivere', 'meglio morto', 'meglio morta',
    'voglio morire', 'vorrei morire', 'mi ammazzo', 'mi ammazzerei', 'pensieri di morte',
    'buttarmi', 'buttarmi giù', 'lanciarmi', 'impiccarmi', 'tagliarmi le vene',
    'overdose', 'prendere delle pastiglie', 'finirla', 'non ce la faccio più a vivere',
    'sarebbe meglio se non ci fossi', 'tutti starebbero meglio senza di me',
    'non valgo niente', 'non ho motivo di vivere', 'la vita non ha senso',
    'presto non sarò più un problema', 'ho deciso di farla finita',
    'ho un piano', 'ho pensato a come farlo', 'questa è la mia ultima',
]

KEYWORDS_VIOLENZA_STALKING = [
    'mi picchia', 'mi maltratta', 'mi perseguita', 'stalking', 'stalker',
    'mi segue', 'mi minaccia', 'minacce', 'violenza', 'abuso', 'abusato', 'abusata',
    'violentato', 'violentata', 'stupro', 'stuprata', 'stuprato', 'molestie',
    'molestato', 'molestata', 'aggredito', 'aggredita', 'botte', 'percosse',
    'picchiato', 'picchiata', 'mi fa del male', 'ho paura di lui', 'ho paura di lei',
    'mi controlla', 'controllo ossessivo', 'non mi lascia uscire', 'mi isola',
    'mi terrorizza', 'relazione tossica', 'violenza domestica', 'maltrattamenti', 'picchiarmi',
    'maltrattarmi', 'perseguitarmi', 'minacciarmi', 'aggredirmi', 'molestarmi', 'abuso sessuale',
    'picchiato', 'picchiata', 'maltrattato', 'maltrattata', 'perseguitato', 'perseguitata',
]

KEYWORDS_AUTOLESIONISMO = [
    'mi taglio', 'mi faccio del male', 'autolesionismo', 'ferirmi', 'farmi male',
    'bruciarmi', 'graffiarmi', 'punirmi fisicamente', 'mi colpisco', 'mi faccio tagli',
]

# Numeri di emergenza
NUMERI_EMERGENZA = {
    'suicidio': {
        'principale': {
            'nome': 'Telefono Azzurro',
            'numero': '19696',
            'orari': '24 ore su 24, 7 giorni su 7'
        },
        'alternativo': {
            'nome': 'Telefono Amico Italia',
            'numero': '02 2327 2327',
            'orari': 'tutti i giorni dalle 9:00 alle 24:00'
        }
    },
    'violenza': {
        'principale': {
            'nome': 'Numero Antiviolenza e Stalking',
            'numero': '1522',
            'orari': '24 ore su 24, 7 giorni su 7 (gratuito)'
        }
    },
    'autolesionismo': {
        'principale': {
            'nome': 'Telefono Azzurro',
            'numero': '19696',
            'orari': '24 ore su 24, 7 giorni su 7'
        },
        'alternativo': {
            'nome': 'Telefono Amico Italia',
            'numero': '02 2327 2327',
            'orari': 'tutti i giorni dalle 9:00 alle 24:00'
        }
    }
}

# Messaggi di conforto per tipo di emergenza
MESSAGGI_CONFORTO = {
    'suicidio': """Capisco che stai attraversando un momento di grande sofferenza. Quello che provi è reale e importante, e non devi affrontarlo da solo/a. 

    In questo momento è fondamentale che tu possa parlare con qualcuno che può aiutarti. Ti prego, contatta subito il tuo medico {nome_medico} al numero {telefono_medico}, oppure:
    
    📞 <strong>Telefono Azzurro: 19696</strong> (attivo 24/7)
    📞 <strong>Telefono Amico Italia: 02 2327 2327</strong> (attivo tutti i giorni dalle 9:00 alle 24:00)
    
    Non sei solo/a. Ci sono persone pronte ad ascoltarti e ad aiutarti in questo momento difficile. La tua vita ha valore.""",

    'violenza': """Mi preoccupo per la tua sicurezza. Quello che stai vivendo non è giusto e non devi affrontarlo da solo/a.
    
    È importante che tu possa ricevere supporto e protezione. Contatta subito il tuo medico {nome_medico} al numero {telefono_medico}, oppure:
    
    📞 <strong>Numero Antiviolenza e Stalking: 1522</strong> (gratuito, attivo 24/7)
    
    Il 1522 offre supporto professionale, anonimo e gratuito. Possono aiutarti a trovare una via d'uscita sicura. Non sei solo/a e meriti di vivere senza paura.""",

    'autolesionismo': """Capisco che stai soffrendo molto e che forse senti il bisogno di sfogare il dolore. Ma ci sono modi più sicuri per gestire queste emozioni intense.
    
    Ti prego, parla con qualcuno che può aiutarti. Contatta il tuo medico {nome_medico} al numero {telefono_medico}, oppure:
    
    📞 <strong>Telefono Azzurro: 19696</strong> (attivo 24/7)
    📞 <strong>Telefono Amico Italia: 02 2327 2327</strong> (attivo tutti i giorni dalle 9:00 alle 24:00)
    
    Non devi affrontare questo da solo/a. Ci sono persone pronte ad ascoltarti senza giudicarti."""
}

EMOZIONI_EMOJI = {
    'gioia': '😊',
    'felicità': '😄',
    'tristezza': '😢',
    'rabbia': '😠',
    'paura': '😨',
    'ansia': '😰',
    'sorpresa': '😲',
    'disgusto': '🤢',
    'vergogna': '😳',
    'colpa': '😔',
    'frustrazione': '😤',
    'speranza': '🌟',
    'gratitudine': '🙏',
    'amore': '❤️',
    'solitudine': '😞',
    'confusione': '😕',
    'stanchezza': '😩',
    'serenità': '😌',
    'nostalgia': '🥺',
    'delusione': '😞',
    'entusiasmo': '🤩',
    'preoccupazione': '😟',
    'calma': '😊',
    'nervosismo': '😬',
    'malinconia': '🥀',
    'inadeguatezza': '😔',
    'disperazione': '😰',
    'orgoglio': '😌',
    'imbarazzo': '😳',
}


CONTESTI_EMOJI = {
    'lavoro': '💼',
    'università': '🎓',
    'scuola': '📚',
    'famiglia': '👨‍👩‍👧‍👦',
    'amicizia': '👥',
    'relazione': '💑',
    'salute': '🏥',
    'sport': '🏋️',
    'palestra': '💪',
    'tempo libero': '🎮',
    'viaggi': '✈️',
    'casa': '🏠',
    'finanze': '💰',
    'spiritualità': '🧘',
    'sociale': '🌐',
    'solitudine': '🚶',
    'studio': '📖',
    'alimentazione': '🍽️',
    'sonno': '😴',
    'altro': '📝',
}

EMOZIONI_CATEGORIE = {
    # Emozioni positive (verde)
    'gioia': 'positive',
    'felicità': 'positive',
    'speranza': 'positive',
    'gratitudine': 'positive',
    'amore': 'positive',
    'serenità': 'positive',
    'entusiasmo': 'positive',
    'calma': 'positive',
    'orgoglio': 'positive',
    # Emozioni negative (rosso)
    'tristezza': 'negative',
    'rabbia': 'negative',
    'disgusto': 'negative',
    'frustrazione': 'negative',
    'solitudine': 'negative',
    'delusione': 'negative',
    'malinconia': 'negative',
    'disperazione': 'negative',
    'inadeguatezza': 'negative',
    'vergogna': 'negative',
    'colpa': 'negative',
    'imbarazzo': 'negative',
    'stanchezza': 'negative',
    'preoccupazione': 'negative',
    # Emozioni ansiose (giallo/ambra)
    'ansia': 'anxious',
    'nervosismo': 'anxious',
    'paura': 'anxious',
    # Emozioni neutre/ambivalenti (lilla)
    'sorpresa': 'neutral',
    'confusione': 'neutral',
    'nostalgia': 'neutral',
}
