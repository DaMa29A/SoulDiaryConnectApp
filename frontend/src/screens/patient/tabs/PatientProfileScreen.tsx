import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../../styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/nav/Navbar';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Colors } from '../../../constants/Colors';
import AuthButton from '../../../components/buttons/AuthButton';
import { infoStyles } from '../../../styles/InfoStyles';

export default function PatientProfileScreen() {
    const navigation = useNavigation<any>();
     
    const patientInfo = {
        nome: 'Mario',
        cognome: 'Rossi',
        email: 'mario.rossi@email.com',
        dataNascita: '14/05/1980',
        codiceFiscale: 'RSSMRA80A01H501U',
        telefono: '333 1234567'
    };

    const handleLogout = () => {
        Alert.alert(
        "Logout",
        "Sei sicuro di voler uscire?",
        [
            { text: "Annulla", style: "cancel" },
            { 
            text: "Esci", 
            style: "destructive", 
            onPress: () => navigation.replace('Login') 
            }
        ]
        );
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
                    <View style={[commonStyles.page, {padding: 10}]}>
                        <View style={[commonStyles.card, {width: '100%'}]}>
                            <View style={[ infoStyles.avatarContainer, {backgroundColor: Colors.backgroundInput}]}>
                                <Ionicons name="person" size={48} color={Colors.grey} />
                            </View>

                            <Text style={infoStyles.infoPrimary}>{patientInfo.nome} {patientInfo.cognome}</Text>
                            <Text style={infoStyles.infoSecondary}>{patientInfo.email}</Text>

                            <View style={infoStyles.infoRow}>
                                <Text style={infoStyles.infoLabel}>Data di Nascita</Text>
                                <Text style={infoStyles.infoValue}>{patientInfo.dataNascita}</Text>
                            </View>

                            <View style={infoStyles.divider} />

                            <View style={infoStyles.infoRow}>
                                <Text style={infoStyles.infoLabel}>Codice Fiscale</Text>
                                <Text style={infoStyles.infoValue}>{patientInfo.codiceFiscale}</Text>
                            </View>

                            <View style={infoStyles.divider} />

                            <View style={infoStyles.infoRow}>
                                <Text style={infoStyles.infoLabel}>Telefono</Text>
                                <Text style={infoStyles.infoValue}>{patientInfo.telefono}</Text>
                            </View>

                            <View style={{ marginTop: 20 }} > 
                                <AuthButton 
                                    title="Esci dal profilo" 
                                    onPress={handleLogout} 
                                    variant='logout'
                                />
                            </View>

                        </View>
                    </View>
                    <Footer />
                </ScrollView>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}