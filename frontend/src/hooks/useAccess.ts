import { useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../constants/Config';
import { UserRole } from '../components/TypeSelector';

export const useAccess = (navigation: any) => {
    const [loading, setLoading] = useState(false);


    // ----- REGISTRAZIONE ------
    const handleRegister = async (userType: UserRole, form: any) => {
        setLoading(true);

        // Mappatura dei dati dal frontend (camelCase) al backend (snake_case di Django)
        const data = new FormData();
        data.append('user_type', userType === 'doctor' ? 'medico' : 'paziente');
        data.append('nome', form.nome);
        data.append('cognome', form.cognome);
        data.append('email', form.email);
        data.append('password', form.password);

        if (userType === 'doctor') {
            data.append('indirizzo_studio', form.indirizzoStudio);
            data.append('citta', form.citta);
            data.append('numero_civico', form.numeroCivico);
            data.append('numero_telefono_studio', form.telefonoStudio);
            data.append('numero_telefono_cellulare', form.telefonoCellulare);
        } else {
            data.append('codice_fiscale', form.codiceFiscale);
            data.append('data_di_nascita', form.dataNascita);
            data.append('med', form.medicoRiferimento); // Il codice identificativo del medico
        }

        console.log(`${API_URL}/register/`)

        try {
            const response = await axios.post(`${API_URL}/register/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Response: "+response)

            Alert.alert("Successo", "Registrazione completata!");
            navigation.navigate('Login');
        } catch (error: any) {
            console.error(error);
            console.log("Error: "+error)
            Alert.alert("Errore", "Si è verificato un problema durante la registrazione.");
        } finally {
            setLoading(false);
        }
    };

    return {
        handleRegister,
        loading
    };
};