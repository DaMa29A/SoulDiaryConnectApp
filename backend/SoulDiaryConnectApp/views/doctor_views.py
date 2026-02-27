from django.http import JsonResponse
from .auth_views import token_required
from ..models import Medico

@token_required
def get_doctor_profile(request):
    """
    Restituisce le informazioni del profilo del medico loggato.
    """
    # 1. Sicurezza: verifichiamo che chi fa la richiesta sia effettivamente un medico
    if request.user_type != 'medico':
        return JsonResponse({'status': 'error', 'message': 'Accesso negato. Non sei autorizzato.'}, status=403)
    
    try:
        # 2. Recuperiamo il medico usando l'ID estratto dal Token (request.user_id)
        medico = Medico.objects.get(codice_identificativo=request.user_id)
        
        # 3. Impacchettiamo i dati che servono al frontend React Native
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
        
        # 4. Restituiamo i dati con successo
        return JsonResponse({'status': 'success', 'data': data})
        
    except Medico.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Medico non trovato nel database.'}, status=404)