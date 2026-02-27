import { useState, useCallback } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Config';

export const useDoctor = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [patientNotes, setPatientNotes] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    // Funzione per caricare le note di un paziente specifico
    const fetchPatientNotes = useCallback(async (codiceFiscale: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.get(`${API_URL}/doctor/patients/${codiceFiscale}/notes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') {
                setPatientNotes(response.data.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Errore nel caricamento note");
        } finally {
            setLoading(false);
        }
    }, []);

    // Funzione per caricare i dettagli anagrafici del paziente (Header)
    const fetchPatientDetails = useCallback(async (codiceFiscale: string) => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.get(`${API_URL}/doctor/patients/${codiceFiscale}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') {
                setSelectedPatient(response.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        patientNotes,
        selectedPatient,
        fetchPatientNotes,
        fetchPatientDetails
    };
};