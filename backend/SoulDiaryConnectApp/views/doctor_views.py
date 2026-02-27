from django.http import JsonResponse
from .auth_views import token_required
from ..models import Medico, Paziente

@token_required
def get_doctor_profile(request):
    """
    Restituisce le informazioni del profilo del medico loggato.
    """
    # Security: we guarantee that the person making the request is actually a doctor.
    if request.user_type != 'medico':
        return JsonResponse({
            'status': 'error', 
            'message': 'Accesso negato. Non sei autorizzato.'
        }, status=403)
    
    try:
        # Retrieve the doctor using the ID extracted from the Token (request.user_id)
        medico = Medico.objects.get(codice_identificativo=request.user_id)
        
        # Package the data needed by the React Native frontend
        data = {
            'nome': medico.nome,
            'cognome': medico.cognome,
            'email': medico.email,
            'indirizzo_studio': medico.indirizzo_studio,
            'citta': medico.citta,
            'numero_civico': medico.numero_civico,
            'numero_telefono_studio': medico.numero_telefono_studio,
            'numero_telefono_cellulare': medico.numero_telefono_cellulare,
        }
        
        # Successfully return the data
        return JsonResponse({
            'status': 'success', 
            'data': data
        })
        
    except Medico.DoesNotExist:
        return JsonResponse({
            'status': 'error', 
            'message': 'Medico non trovato nel database.'
        }, status=404)
    

@token_required
def get_doctor_patients(request):
    """
    Returns the list of patients associated with the logged in doctor.
    """
    # Security check
    if request.user_type != 'medico':
        return JsonResponse({
            'status': 'error', 
            'message': 'Accesso negato. Solo i medici possono vedere la lista pazienti.'
        }, status=403)
    
    try:
        # Find all patients whose doctor matches the token ID
        pazienti = Paziente.objects.filter(med_id=request.user_id).values(
            'codice_fiscale', 
            'nome', 
            'cognome', 
            'data_di_nascita', 
            'email'
        )
        
        lista_pazienti = list(pazienti)
        
        return JsonResponse({
            'status': 'success', 
            'data': lista_pazienti
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error', 
            'message': str(e)
        }, status=500)


@token_required
def get_patient_details(request, codice_fiscale):
    """
    Returns the details of a single patient, verifying that it belongs to the doctor.
    """
    if request.user_type != 'medico':
        return JsonResponse({
            'status': 'error', 
            'message': 'Non autorizzato'
        }, status=403)
    
    try:
        # We use med_id=request.user_id to make sure one doctor can't spy on another doctor's patients!
        paziente = Paziente.objects.get(codice_fiscale=codice_fiscale, med_id=request.user_id)
        
        data = {
            'nome': paziente.nome,
            'cognome': paziente.cognome,
            'codice_fiscale': paziente.codice_fiscale,
            # Format the date in a readable format (e.g. 01/12/1990)
            'data_di_nascita': paziente.data_di_nascita.strftime('%d/%m/%Y') if paziente.data_di_nascita else 'N/D',
        }
        
        return JsonResponse({
            'status': 'success', 
            'data': data
        })
        
    except Paziente.DoesNotExist:
        return JsonResponse({
            'status': 'error', 
            'message': 'Paziente non trovato o non autorizzato'
        }, status=404)