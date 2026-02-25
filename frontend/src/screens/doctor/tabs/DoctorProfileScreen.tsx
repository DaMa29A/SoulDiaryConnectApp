import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../../styles/CommonStyles';
import { infoStyles } from '../../../styles/InfoStyles';
import { Colors } from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/nav/Navbar';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import AuthButton from '../../../components/buttons/AuthButton';

export default function DoctorProfileScreen() { 
    const navigation = useNavigation<any>();

    const doctorInfo = {
        nome: 'Giuseppe',
        cognome: 'Veronesi',
        email: 'giuseppe.veronesi@studio.it',
        indirizzo: 'Via dei Mille 45, Roma',
        telefono: '06 12345678'
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
                            
                            <View style={[ infoStyles.avatarContainer, {backgroundColor: Colors.background}]}>
                                <Ionicons name="medkit" size={48} color={Colors.primary} />
                            </View>

                            <Text style={infoStyles.infoPrimary}>{doctorInfo.nome} {doctorInfo.cognome}</Text>

                            <View style={infoStyles.infoRow}>
                                <Text style={infoStyles.infoLabel}>Email</Text>
                                <Text style={infoStyles.infoValue}>{doctorInfo.email}</Text>
                            </View>

                            <View style={infoStyles.divider} />

                            <View style={infoStyles.infoRow}>
                                <Text style={infoStyles.infoLabel}>Indirizzo</Text>
                                <Text style={infoStyles.infoValue}>{doctorInfo.indirizzo}</Text>
                            </View>

                            <View style={infoStyles.divider} />

                            <View style={infoStyles.infoRow}>
                                <Text style={infoStyles.infoLabel}>Telefono</Text>
                                <Text style={infoStyles.infoValue}>{doctorInfo.telefono}</Text>
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