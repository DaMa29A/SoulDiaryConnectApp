import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../../styles/CommonStyles';
import { Colors } from '../../../constants/Colors';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import NoteForm from '../../../components/forms/NoteForm';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/nav/Navbar';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import NotesList from '../../../components/notes/NotesList';

// Importa l'hook personalizzato per le chiamate API
import { usePatient } from '../../../hooks/usePatient';

export default function PatientDiaryScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused(); // Utile per ricaricare i dati quando l'utente torna su questa tab
     
    // Stati locali per il form
    const [noteText, setNoteText] = useState('');
    const [isAiSupportEnabled, setIsAiSupportEnabled] = useState(false);

    // Estrae funzioni e stati dal nostro hook aggiornato
    const { createNote, fetchNotes, notes, loading } = usePatient();

    // Al caricamento della schermata, fetchiamo le note dal server
    useEffect(() => {
        if (isFocused) {
            fetchNotes();
        }
    }, [isFocused, fetchNotes]);

    // Funzione utility per mappare le note grezze del DB nel formato grafico richiesto da NotesList
    const formatNotesForUI = (apiNotes: any[]) => {
        const mesi = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
        
        return apiNotes.map(nota => {
            const date = new Date(nota.data_iso);
            const day = date.getDate().toString().padStart(2, '0');
            const month = mesi[date.getMonth()];
            const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            return {
                id: nota.id,
                day: day,
                month: month,
                text: nota.testo,
                time: time
            };
        });
    };

    const displayNotes = formatNotesForUI(notes);

    // Gestione del salvataggio della nota
    const handleSaveNote = async () => {
        if (noteText.trim() === '') {
            Alert.alert("Attenzione", "La nota non può essere vuota.");
            return;
        }
        
        try {
            await createNote(noteText, isAiSupportEnabled);
            
            Alert.alert("Salvato", "La tua nota è stata aggiunta al diario.");
            
            // Resetta il form
            setNoteText('');
            setIsAiSupportEnabled(false);
            
            // RICARICA LA LISTA DELLE NOTE PER MOSTRARE QUELLA APPENA INSERITA
            fetchNotes();
            
        } catch (error: any) {
            Alert.alert("Errore", error.message || "Impossibile salvare la nota. Riprova più tardi.");
        }
    };

    const handleVoiceInput = () => {
        Alert.alert("Dettatura", "Funzionalità di dettatura vocale in arrivo.");
    };

    const handleNotePress = (id: number | string) => {
        navigation.navigate('NoteDetails', { noteId: id });
    };

    return ( 
        <SafeAreaView style={commonStyles.safe_container_log} edges={['top']}>
            <Navbar/>
            <View style={commonStyles.container_log}>
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1}} 
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[commonStyles.page_left]}>
                        
                        {/* --- HEADER SEZIONE INSERIMENTO --- */}
                        <View style={styles.sectionHeaderContainer}>
                            <Ionicons name="pencil" size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Come ti senti oggi?</Text>
                        </View>

                        {/* --- FORM DI INSERIMENTO --- */}
                        <NoteForm 
                            noteText={noteText}
                            setNoteText={setNoteText}
                            isAiSupportEnabled={isAiSupportEnabled}
                            setIsAiSupportEnabled={setIsAiSupportEnabled}
                            onSave={handleSaveNote}
                            onVoiceInput={handleVoiceInput}
                            loading={loading}
                        />

                        {/* --- HEADER SEZIONE DIARIO STORICO --- */}
                        <View style={styles.sectionHeaderContainer}>
                            <Ionicons name="document" size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Il mio diario</Text>
                        </View>

                        {/* --- LISTA DELLE NOTE DINAMICA --- */}
                        {notes.length === 0 && !loading ? (
                            <Text style={styles.emptyText}>Non hai ancora scritto nessuna nota. Inizia a tenere traccia delle tue giornate!</Text>
                        ) : (
                            <NotesList 
                                notes={displayNotes} 
                                onNotePress={handleNotePress} 
                            />
                        )}

                    </View>
                    <Footer />
                </ScrollView>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionHeaderContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textDark,
        marginLeft: 8, 
    },
    emptyText: {
        fontSize: 16,
        color: Colors.grey,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 40
    }
});