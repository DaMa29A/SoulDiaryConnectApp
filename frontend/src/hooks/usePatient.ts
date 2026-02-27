import { useState, useCallback } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/Config';

export const usePatient = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState<any[]>([]);
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [patientInfo, setPatientInfo] = useState<any>(null);
    const [doctorInfo, setDoctorInfo] = useState<any>(null);

    // Salvataggio nota
    const createNote = useCallback(async (testo: string, aiSupport: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.post(`${API_URL}/patient/note/create/`, {
                testo: testo,
                aiSupport: aiSupport
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err: any) {
            const msg = err.response?.data?.message || "Errore nel salvataggio";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    // Lista note
    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.get(`${API_URL}/patient/note/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') setNotes(response.data.data);
        } catch (err) {
            console.error("Errore fetchNotes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Dettaglio singola nota
    const fetchNoteDetails = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.get(`${API_URL}/patient/note/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') {
                setSelectedNote(response.data.data);
            }
        } catch (err: any) {
            setError("Impossibile caricare i dettagli della nota.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Eliminazione nota
    const deleteNote = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.delete(`${API_URL}/patient/note/${id}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.status === 'success';
        } catch (err) {
            console.error("Errore eliminazione:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Info Paziente
    const fetchPatientInfo = useCallback(async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.get(`${API_URL}/patient/info/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') setPatientInfo(response.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    // Info Medico
    const fetchDoctorInfo = useCallback(async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await axios.get(`${API_URL}/patient/doctor/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') setDoctorInfo(response.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    return { 
        loading, error, notes, selectedNote, patientInfo, doctorInfo,
        createNote, fetchNotes, fetchNoteDetails, deleteNote, fetchPatientInfo, fetchDoctorInfo 
    };
};