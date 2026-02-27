import { useState, useCallback } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Config'; // Assicurati che il percorso sia corretto

export const useDoctor = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [profile, setProfile] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]);

    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    // Get doctor profile
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

    // Get doctor's patien list
    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) throw new Error("Nessun token di accesso trovato.");

            const response = await axios.get(`${API_URL}/doctor/patients/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setPatients(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            console.error("Errore fetchPatients:", err);
            setError(err.response?.data?.message || "Errore di connessione al server");
        } finally {
            setLoading(false);
        }
    }, []);

    // Recover single patient
    const fetchPatientDetails = useCallback(async (codice_fiscale: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) throw new Error("Nessun token.");

            const response = await axios.get(`${API_URL}doctor/patients/${codice_fiscale}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setSelectedPatient(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            console.error("Errore fetchPatientDetails:", err);
            setError(err.response?.data?.message || "Errore di connessione al server");
        } finally {
            setLoading(false);
        }
    }, []);

    // Exports
    return { 
        profile, 
        patients, 
        selectedPatient, 

        loading, 
        error, 

        fetchProfile,
        fetchPatients,
        fetchPatientDetails
    };
};