import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Medico, Paziente

# ============================================================================
# DECORATORE DI SICUREZZA (IL "GUARDIANO")
# ============================================================================
def token_required(f):
    """
    Decoratore che protegge le viste. Controlla che la richiesta
    contenga un Token JWT valido nell'header 'Authorization'.
    """
    @wraps(f)
    def decorated(request, *args, **kwargs):
        token = None
        
        # Cerca il token nell'header della richiesta
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            # Il formato standard che React Native dovrà inviare è: "Bearer eyJhbGciOi..."
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return JsonResponse({'status': 'error', 'message': 'Token mancante! Accesso negato.'}, status=401)
        
        try:
            # Decodifica e verifica matematicamente il token
            data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Attacca le info dell'utente alla request, così le altre view sanno chi è loggato!
            request.user_id = data['user_id']
            request.user_type = data['user_type']
            
        except jwt.ExpiredSignatureError:
            return JsonResponse({'status': 'error', 'message': 'Token scaduto! Effettua di nuovo il login.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'status': 'error', 'message': 'Token non valido!'}, status=401)
        
        return f(request, *args, **kwargs)
    return decorated


# ============================================================================
# VISTE DI AUTENTICAZIONE (API)
# ============================================================================
@csrf_exempt
def login_view(request):
    """
    Riceve email e password. Se corretti, restituisce un Token JWT.
    """
    print("Login")
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        medico = Medico.objects.filter(email=email, password=password).first()
        paziente = Paziente.objects.filter(email=email, password=password).first()

        user = medico if medico else paziente
        user_type = 'medico' if medico else ('paziente' if paziente else None)

        if user:
            user_id = user.codice_identificativo if medico else user.codice_fiscale
            
            # Prepara il contenuto del token
            payload = {
                'user_id': user_id,
                'user_type': user_type,
                # Il token scadrà tra 7 giorni esatti
                'exp': datetime.now(timezone.utc) + timedelta(days=7) 
            }

            # Genera il Token firmandolo con la SECRET_KEY del tuo progetto Django
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            return JsonResponse({
                'status': 'success',
                'token': token,
                'user_type': user_type,
                'user_id': user_id
            })
        else:
            return JsonResponse({'status': 'error', 'message': 'Credenziali non valide'}, status=401)
            
    return JsonResponse({'status': 'error', 'message': 'Metodo non consentito. Usa POST.'}, status=405)


@csrf_exempt
def register_view(request):
    """
    Registra un nuovo Medico o Paziente da React Native.
    """
    print("Registrazione")
    if request.method == 'POST':
        try:
            user_type = request.POST.get('user_type')
            nome = request.POST.get('nome')
            cognome = request.POST.get('cognome')
            email = request.POST.get('email')
            password = request.POST.get('password')

            if user_type == 'medico':
                # Generazione automatica del codice identificativo
                ultimo_medico = Medico.objects.all().order_by('-codice_identificativo').first()
                if ultimo_medico:
                    try:
                        ultimo_codice = int(ultimo_medico.codice_identificativo)
                        nuovo_codice = str(ultimo_codice + 1)
                    except ValueError:
                        nuovo_codice = '1'
                else:
                    nuovo_codice = '1'

                Medico.objects.create(
                    codice_identificativo=nuovo_codice,
                    nome=nome,
                    cognome=cognome,
                    indirizzo_studio=request.POST.get('indirizzo_studio', ''),
                    citta=request.POST.get('citta', ''),
                    numero_civico=request.POST.get('numero_civico', ''),
                    numero_telefono_studio=request.POST.get('numero_telefono_studio', ''),
                    numero_telefono_cellulare=request.POST.get('numero_telefono_cellulare', ''),
                    email=email,
                    password=password,
                    tipo_nota=False,
                    lunghezza_nota=False,
                )
                
            elif user_type == 'paziente':
                Paziente.objects.create(
                    codice_fiscale=request.POST.get('codice_fiscale'),
                    nome=nome,
                    cognome=cognome,
                    data_di_nascita=request.POST.get('data_di_nascita'),
                    med=Medico.objects.get(codice_identificativo=request.POST.get('med')),
                    email=email,
                    password=password,
                )

            return JsonResponse({'status': 'success', 'message': 'Registrazione completata con successo!'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Metodo non consentito. Usa POST.'}, status=405)


@csrf_exempt
def logout_view(request):
    """
    Endpoint di logout.
    NOTA BENE: Con i JWT, il vero logout avviene in React Native 
    cancellando il token dal telefono (es. SecureStore.deleteItemAsync).
    Questo endpoint serve solo a dare una conferma di successo all'app.
    """
    return JsonResponse({
        'status': 'success', 
        'message': 'Logout backend confermato. Ricordati di eliminare il token sul frontend!'
    })