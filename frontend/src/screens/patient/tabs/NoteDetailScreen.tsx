import React from 'react';
import { 
    View, 
    ScrollView, 
    TouchableOpacity, 
    Text, 
    StyleSheet,
    Alert // <-- Aggiunto import per l'Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../../styles/CommonStyles';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '../../../constants/Colors'; 
import Navbar from '../../../components/nav/Navbar';
import Footer from '../../../components/Footer';
import NoteCard from '../../../components/notes/cards/NoteCard';
import AuthButton from '../../../components/buttons/AuthButton';
import { useNavigation } from '@react-navigation/native'; // Aggiunto per poter tornare indietro dopo l'eliminazione
import KeywordList, { KeywordItem } from '../../../components/keywords/KeywordList';

export default function NoteDetailScreen() {
    const navigation = useNavigation();

    const note_details = {
        id: 1,
        fullDate: 'Lunedì, 14 Ottobre 2023',
        time: '18:30',
        patientNote: {
            text: "Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco e il sole mi ha aiutato a schiarirmi le idee. L'ansia era presente stamattina, ma l'ho gestita con gli esercizi di respirazione.",
            moodIcon: 'sunny-outline' 
        },
        aiInsight: {
            hasInsight: true, 
            text: "Hai dimostrato una grande capacità di gestire le emozioni. Continua a praticare gli esercizi di respirazione per mantenere il tuo benessere.",
        },
        doctorComment: {
            hasComment: true,
            doctorName: 'Dott. G. Veronesi',
            date: '15 Ott, 10:15',
            text: "Ottimo lavoro Mario. L'applicazione degli esercizi di respirazione nel momento del bisogno è un passo fondamentale. Ne parleremo nella prossima seduta.",
        }
    };

    const mockKeywords: KeywordItem[] = [
        { id: '1', word: 'Tristezza', emoji: '😢', description: 'Uno stato emotivo caratterizzato da sentimenti di svantaggio, perdita e impotenza.' },
        { id: '2', word: 'Studio', emoji: '📚', description: 'Attività dedicata all\'apprendimento, che in questo contesto può essere fonte di stress o concentrazione.' },
        { id: '3', word: 'Ansia', emoji: '⚡', description: 'Stato di agitazione o forte apprensione per eventi futuri o situazioni di incertezza.' },
        { id: '4', word: 'Natura', emoji: '🌿', description: 'Elemento ambientale che ha favorito il rilassamento e la riduzione del battito cardiaco.' },
];

    const handleGenerateInsight = () => {
        console.log("Chiamata API per generare la frase in corso...");
    };

    // --- NUOVA FUNZIONE PER L'ELIMINAZIONE ---
    const handleDeleteNote = () => {
        Alert.alert(
            "Elimina Nota", // Titolo dell'Alert
            "Sei sicuro di voler eliminare la nota?", // Messaggio
            [
                {
                    text: "Annulla",
                    style: "cancel" // Su iOS apparirà con lo stile tipico di annullamento
                },
                {
                    text: "Elimina",
                    style: "destructive", // Su iOS apparirà in rosso
                    onPress: () => {
                        console.log("Nota eliminata!");
                        // Qui inserirai la logica API per eliminare davvero la nota
                        
                        // Dopo l'eliminazione, torna alla schermata precedente
                        navigation.goBack(); 
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={commonStyles.safe_container_log} edges={['top']}>
            <Navbar showBackArrow={true}/>
            <View style={commonStyles.container_log}>
                <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1}} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                >
                    <View style={[commonStyles.page_left, {paddingHorizontal: 10, paddingVertical: 20}]}>
                        
                        <KeywordList keywords={mockKeywords} />
                        
                        {/* --- PATIENT NOTE --- */}
                        <NoteCard 
                            text={note_details.patientNote.text} 
                            time={note_details.time} 
                            type = 'patient'
                        />

                        {/* --- AI NOTE --- */}
                        {note_details.aiInsight.hasInsight ? (
                            <NoteCard 
                                text={note_details.aiInsight.text} 
                                time={note_details.time} 
                                type = 'ai'
                            />
                        ) : (
                            <View style={{ marginBottom : 25, width: '100%' }}>
                                <AuthButton 
                                    title='Genera frase di supporto' 
                                    onPress={handleGenerateInsight}
                                    variant='primary'
                                    iconName='sparkles'
                                    iconFamily='ionicons' 
                                />
                            </View>
                        )}

                        {/* --- DOCTOR COMMENT --- */}
                        {note_details.doctorComment.hasComment && (
                            <NoteCard 
                                doctorName={note_details.doctorComment.doctorName}
                                time={note_details.doctorComment.date}
                                text={note_details.doctorComment.text}
                                type='doctor'
                            />
                        )}

                        {/* --- DELETE NOTE --- */}
                        <View style={styles.deleteContainer}>
                            <AuthButton 
                                title='Elimina nota' 
                                onPress={handleDeleteNote}
                                variant='logout'
                                iconName='trash-outline' 
                                iconFamily='ionicons' 
                            />
                        </View>

                    </View>
                    <Footer />
                </ScrollView>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
     );
}

const styles = StyleSheet.create({
    // --- STILE PER CENTRARE IL PULSANTE ---
    deleteContainer: {
        width: '100%',
        alignItems: 'center', // Centra orizzontalmente il pulsante
        marginTop: 40, // Dà un po' di respiro dalle note sopra
        marginBottom: 10,
    }
});