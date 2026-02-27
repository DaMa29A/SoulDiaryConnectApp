import React, { useEffect } from 'react';
import { 
    View, 
    ScrollView, 
    Text, 
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { commonStyles } from '../../../styles/CommonStyles';
import { Colors } from '../../../constants/Colors'; 
import Navbar from '../../../components/nav/Navbar';
import Footer from '../../../components/Footer';
import NoteCard from '../../../components/notes/cards/NoteCard';
import AuthButton from '../../../components/buttons/AuthButton';
import KeywordList, { KeywordItem } from '../../../components/keywords/KeywordList';
import { usePatient } from '../../../hooks/usePatient';

export default function NoteDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { noteId } = route.params; // ID passato dalla navigazione

    const { fetchNoteDetails, selectedNote, deleteNote, loading, error } = usePatient();

    // Carica i dati all'apertura
    useEffect(() => {
        fetchNoteDetails(noteId);
    }, [noteId, fetchNoteDetails]);

    const handleDeleteNote = () => {
        Alert.alert(
            "Elimina Nota",
            "Sei sicuro di voler eliminare definitivamente questa nota dal tuo diario?",
            [
                { text: "Annulla", style: "cancel" },
                { 
                    text: "Elimina", 
                    style: "destructive", 
                    onPress: async () => {
                        const success = await deleteNote(noteId);
                        if (success) {
                            navigation.goBack(); // Torna al diario
                        } else {
                            Alert.alert("Errore", "Non è stato possibile eliminare la nota.");
                        }
                    } 
                }
            ]
        );
    };

    if (loading && !selectedNote) {
        return (
            <View style={{flex:1, justifyContent:'center', backgroundColor: Colors.background}}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{textAlign:'center', marginTop:10, color: Colors.grey}}>Caricamento nota...</Text>
            </View>
        );
    }

    if (error || !selectedNote) {
        return (
            <SafeAreaView style={commonStyles.safe_container_log}>
                <Navbar showBackArrow={true}/>
                <View style={{flex:1, justifyContent:'center', padding:20}}>
                    <Text style={{textAlign:'center', color:'red'}}>{error || "Nota non trovata"}</Text>
                    <AuthButton title="Torna indietro" onPress={() => navigation.goBack()} />
                </View>
            </SafeAreaView>
        );
    }

    // Costruisce la lista delle Keywords basandosi sui dati dell'IA
    const keywords: KeywordItem[] = [];
    if (selectedNote.emozione) {
        keywords.push({ 
            id: 'emo', 
            word: selectedNote.emozione.charAt(0).toUpperCase() + selectedNote.emozione.slice(1), 
            emoji: '✨', 
            description: selectedNote.spiegazione_emozione 
        });
    }
    if (selectedNote.contesto) {
        keywords.push({ 
            id: 'ctx', 
            word: selectedNote.contesto.charAt(0).toUpperCase() + selectedNote.contesto.slice(1), 
            emoji: '📍', 
            description: selectedNote.spiegazione_contesto 
        });
    }

    return (
        <SafeAreaView style={commonStyles.safe_container_log} edges={['top']}>
            <Navbar showBackArrow={true}/>
            <View style={commonStyles.container_log}>
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1}} 
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[commonStyles.page_left, {paddingHorizontal: 15, paddingVertical: 20}]}>
                        
                        <Text style={styles.dateHeader}>{selectedNote.data_formattata}</Text>

                        {/* --- KEYWORDS DALL'IA --- */}
                        {keywords.length > 0 && (
                            <View style={{marginBottom: 10}}>
                                <KeywordList keywords={keywords} />
                            </View>
                        )}
                        
                        {/* --- TESTO PAZIENTE --- */}
                        <NoteCard 
                            text={selectedNote.testo_paziente} 
                            time={selectedNote.ora} 
                            type='patient'
                        />

                        {/* --- SUPPORTO AI --- */}
                        {selectedNote.testo_supporto ? (
                            <NoteCard 
                                text={selectedNote.testo_supporto} 
                                time={selectedNote.ora} 
                                type='ai'
                            />
                        ) : selectedNote.generazione_in_corso ? (
                            <View style={styles.aiPendingBox}>
                                <ActivityIndicator size="small" color={Colors.primary} />
                                <Text style={styles.aiPendingText}>L'intelligenza artificiale sta analizzando la nota...</Text>
                            </View>
                        ) : null}

                        {/* --- ELIMINAZIONE --- */}
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
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textDark,
        marginBottom: 15,
        marginLeft: 5
    },
    deleteContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    aiPendingBox: {
        backgroundColor: '#F8F9FA',
        padding: 20,
        borderRadius: 15,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    aiPendingText: {
        marginLeft: 10,
        color: Colors.primary,
        fontStyle: 'italic'
    }
});