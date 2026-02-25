import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import NoteForm from '../../../components/forms/NoteForm';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/nav/Navbar';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import NotesList from '../../../components/notes/NotesList';

export default function PatientDiaryScreen() {
    const navigation = useNavigation<any>();
     
    const [noteText, setNoteText] = useState('');
    const [isAiSupportEnabled, setIsAiSupportEnabled] = useState(false);

    const notes_list = [
        { id: 1, day: '14', month: 'OTT', text: 'Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco.', time: '18:30' },
        { id: 2, day: '12', month: 'OTT', text: 'Ho avuto un momento di ansia nel pomeriggio, ma è passato dopo aver parlato con Laura.', time: '09:15' },
        { id: 3, day: '10', month: 'OTT', text: 'Iniziato il nuovo piano terapeutico prescritto dal Dott. Veronesi.', time: '21:00' },
    ];

    const handleSaveNote = () => {
        if (noteText.trim() === '') {
            Alert.alert("Attenzione", "La nota non può essere vuota.");
            return;
        }
        
        console.log("Nota salvata:", noteText);
        console.log("AI Support:", isAiSupportEnabled);
        
        Alert.alert("Salvato", "La tua nota è stata aggiunta al diario.");
        setNoteText('');
    };

    const handleVoiceInput = () => {
        Alert.alert("Dettatura", "Funzionalità di dettatura vocale in arrivo.");
    };

    const handleNotePress = (id: number | string) => {
        console.log('Hai cliccato sulla nota:', id);
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
                        {/* --- HEADER --- */}
                        <View style={styles.sectionHeaderContainer}>
                            <Ionicons name="pencil" size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Come ti senti oggi?</Text>
                        </View>
                        {/* --- FORM --- */}
                        <NoteForm 
                            noteText={noteText}
                            setNoteText={setNoteText}
                            isAiSupportEnabled={isAiSupportEnabled}
                            setIsAiSupportEnabled={setIsAiSupportEnabled}
                            onSave={handleSaveNote}
                            onVoiceInput={handleVoiceInput}
                        />
                        {/* --- NOTES LIST --- */}
                        <View style={styles.sectionHeaderContainer}>
                            <Ionicons name="document" size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Il mio diario</Text>
                        </View>

                        <NotesList 
                            notes={notes_list} 
                            onNotePress={handleNotePress} 
                        />

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
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textDark,
        marginLeft: 8, 
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textDark,
        marginVertical: 24,
    },
});