import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../../../styles/CommonStyles';
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/nav/Navbar';
import PatientsList from '../../../components/patients/PatientsList';


export default function DoctorListPatientsScreen() {
    const navigation = useNavigation<any>();

    const patients_list = [
        { id: '1', name: 'Mario Rossi', lastUpdate: 'Oggi, 14:30', hasNew: true },
        { id: '2', name: 'Luigi Verdi', lastUpdate: 'Ieri, 09:15', hasNew: false },
        { id: '3', name: 'Anna Bianchi', lastUpdate: '12 Ott, 18:00', hasNew: false },
        { id: '4', name: 'Giulia Neri', lastUpdate: '10 Ott, 11:20', hasNew: true },
        { id: '5', name: 'Francesco Gialli', lastUpdate: '05 Ott, 16:45', hasNew: false },
    ];

    const [searchText, setSearchText] = useState('');

    const filteredPatients = patients_list.filter(p => 
        p.name.toLowerCase().includes(searchText.toLowerCase())
    );


    return ( 
        <SafeAreaView style={commonStyles.safe_container_log} edges={['top']}>
            <Navbar/>
            <View style={commonStyles.container_log}>
                {/* --- Header --- */}
                <View style={styles.header}>
                    <Text style={styles.title}>I tuoi Pazienti</Text>
                    <Text style={styles.subtitle}>Gestisci i diari</Text>
                </View>

                {/* --- Search --- */}
                <View style={commonStyles.inputContainer}>
                    <Ionicons name="search-outline" size={20} color={Colors.grey} />
                    <TextInput 
                        style={[commonStyles.input, {marginLeft: 10}]}
                        placeholder="Cerca paziente..."
                        placeholderTextColor={Colors.placeholderInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* --- SrollView --- */}
                <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1}} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                >
                    <View style={[commonStyles.page_left]}>

                        {/* --- Patients List --- */}
                        <PatientsList 
                            patients={filteredPatients} 
                            onPatientPress={(id, name) => {
                            navigation.navigate('DoctorPatientDetailsTabs', { 
                                patientId: id, 
                                patientName: name 
                            });
                            }} 
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
    header: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.textDark,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textGray,
        marginTop: 4,
    }  
});