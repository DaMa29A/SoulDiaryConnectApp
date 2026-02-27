import { useState, useCallback } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Config'; // Assicurati che il percorso sia corretto

export const useDoctor = () => {
    // Stati generici
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Stati specifici per i dati
    const [profile, setProfile] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]); // Pronto per il futuro!

    // 1. FUNZIONE: Recupera Profilo
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) throw new Error("Nessun token di accesso trovato.");

            const response = await axios.get(`${API_URL}/doctor/profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                setProfile(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            console.error("Errore fetchProfile:", err);
            setError(err.response?.data?.message || "Errore di connessione al server");
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // 2. FUNZIONE: Recupera Lista Pazienti (Esempio per il futuro)
    // ==========================================
    /*
    const fetchPatients = useCallback(async () => {
        // ... logica simile a fetchProfile, ma fa un axios.get su /api/medico/pazienti/
        // ... e poi setPatients(response.data.data)
    }, []);
    */

    // Esportiamo tutto quello che ci serve
    return { 
        // Stati
        profile, 
        patients,
        loading, 
        error, 
        
        // Funzioni
        fetchProfile,
        // fetchPatients
    };
};