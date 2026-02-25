import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { commonStyles } from '../../../../../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../../../constants/Colors';
import Footer from '../../../../../components/Footer';
import NotesList from '../../../../../components/notes/NotesList';

export default function NoteListScreen() {
  const navigation = useNavigation<any>();

  const notes_list = [
    { id: 1, day: '14', month: 'OTT', text: 'Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco.', time: '18:30' },
    { id: 2, day: '12', month: 'OTT', text: 'Ho avuto un momento di ansia nel pomeriggio, ma è passato dopo aver parlato con Laura.', time: '09:15' },
    { id: 3, day: '10', month: 'OTT', text: 'Iniziato il nuovo piano terapeutico prescritto dal Dott. Veronesi.', time: '21:00' },
  ];

  const handleNotePress = (id: number | string) => {
    console.log('Hai cliccato sulla nota:', id);
    navigation.navigate('NoteDetailsForm', { noteId: id });
  };


  return (
    <ScrollView 
    style={{ flex: 1, backgroundColor:Colors.white }}
    contentContainerStyle={{ flexGrow: 1}} 
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    >
      <View style={[commonStyles.page_left, {marginTop:20}]}>
        <NotesList 
            notes={notes_list} 
            onNotePress={handleNotePress} 
          />  
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
});