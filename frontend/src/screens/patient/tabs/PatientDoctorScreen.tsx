import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../../styles/CommonStyles';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/nav/Navbar';
import { Colors } from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { infoStyles } from '../../../styles/InfoStyles';

export default function PatientDoctorScreen() { 
    const doctorInfo = {
        name: 'Dott. Giuseppe Veronesi',
        specialization: 'Psicoterapeuta',
        email: 'giuseppe.veronesi@studio.it',
        address: 'Via dei Mille 45, Roma',
        phone: '06 12345678',
        mobile: '333 9876543' 
    };

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${doctorInfo.email}`);
    };

    const handlePhonePress = () => {
        Linking.openURL(`tel:${doctorInfo.phone.replace(/ /g, '')}`);
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
                            <View style={[  infoStyles.avatarContainer, {backgroundColor: Colors.background}]}>
                                <Ionicons name="medkit" size={48} color={Colors.primary} />
                            </View>

                            <Text style={infoStyles.infoPrimary}>{doctorInfo.name}</Text>

                            <View style={infoStyles.divider} />

                            <View style={{marginTop: 20}}>
                                <TouchableOpacity style={infoStyles.contactRow} onPress={handleEmailPress}>
                                    <View style={infoStyles.iconContainer}>
                                        <Ionicons name="mail-outline" size={22} color={Colors.grey} />
                                    </View>
                                    <View style={infoStyles.contactInfo}>
                                        <Text style={infoStyles.contactLabel}>Email</Text>
                                        <Text style={infoStyles.contactValue}>{doctorInfo.email}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                                </TouchableOpacity>

                                <View style={infoStyles.contactRow}>
                                    <View style={infoStyles.iconContainer}>
                                        <Ionicons name="location-outline" size={22} color={Colors.grey} />
                                    </View>
                                    <View style={infoStyles.contactInfo}>
                                        <Text style={infoStyles.contactLabel}>Indirizzo Studio</Text>
                                        <Text style={infoStyles.contactValue}>{doctorInfo.address}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={infoStyles.contactRow} onPress={handlePhonePress}>
                                    <View style={infoStyles.iconContainer}>
                                        <Ionicons name="call-outline" size={22} color={Colors.grey} />
                                    </View>
                                    <View style={infoStyles.contactInfo}>
                                        <Text style={infoStyles.contactLabel}>Telefono Studio</Text>
                                        <Text style={infoStyles.contactValue}>{doctorInfo.phone}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                                </TouchableOpacity>
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