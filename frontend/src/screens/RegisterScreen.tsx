import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App'; 
import { loginStyles } from '../styles/LoginStyles';
import { commonStyles } from '../styles/CommonStyles';
import { Colors } from '../constants/Colors';
import Logo from '../components/Logo';
import AuthButton from '../components/AuthButton';
import Footer from '../components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [userType, setUserType] = useState<'medico' | 'paziente'>('medico');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form State
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    indirizzoStudio: '',
    numeroCivico: '',
    citta: '',
    telefonoStudio: '',
    telefonoCellulare: '',
    codiceFiscale: '',
    dataNascita: '',
    medicoRiferimento: '',
  });

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || form.dataNascita;
    setShowDatePicker(Platform.OS === 'ios');
    updateForm('dataNascita', currentDate);
  };

  const handleRegister = () => {
    if (!form.email || !form.password || !form.nome) {
      Alert.alert("Attenzione", "Compila i campi obbligatori.");
      return;
    }
    console.log(`Registrazione ${userType}:`, form);
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <Logo scale={0.75} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View> 
              
              

              {/* WHITE CARD */}
              <View style={commonStyles.card}>
                <Text style={commonStyles.welcomeTitle}>Crea Account</Text>
                <Text style={commonStyles.welcomeSub}>Seleziona il tuo profilo e registrati</Text>

                {/* --- SELECTOR --- */}
                <View style={localStyles.selectionContainer}>
                  <TouchableOpacity 
                    style={[localStyles.selectionBox, userType === 'medico' && localStyles.selectedBox]}
                    onPress={() => setUserType('medico')}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name="medkit-outline" 
                      size={24} 
                      color={userType === 'medico' ? Colors.primary  : Colors.textGray} 
                      style={{ marginBottom: 4 }}
                    />
                    <Text style={[localStyles.boxText, userType === 'medico' && localStyles.selectedBoxText]}>
                      Medico
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[localStyles.selectionBox, userType === 'paziente' && localStyles.selectedBox]}
                    onPress={() => setUserType('paziente')}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name="person-outline" 
                      size={24} 
                      color={userType === 'paziente' ? Colors.primary : Colors.textGray} 
                      style={{ marginBottom: 4 }}
                    />
                    <Text style={[localStyles.boxText, userType === 'paziente' && localStyles.selectedBoxText]}>
                      Paziente
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* --- FIELDS --- */}
                <View style={localStyles.row}>
                  <View style={{ width: '48%' }}>
                    <Text style={commonStyles.inputLabel}>Nome</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="Nome"
                        placeholderTextColor={Colors.placeholderInput}
                        value={form.nome}
                        onChangeText={(t) => updateForm('nome', t)}
                      />
                    </View>
                  </View>
                  <View style={{ width: '48%' }}>
                    <Text style={commonStyles.inputLabel}>Cognome</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="Cognome"
                        placeholderTextColor={Colors.placeholderInput}
                        value={form.cognome}
                        onChangeText={(t) => updateForm('cognome', t)}
                      />
                    </View>
                  </View>
                </View>

                <Text style={commonStyles.inputLabel}>Email</Text>
                <View style={commonStyles.inputContainer}>
                  <TextInput 
                    style={commonStyles.input}
                    placeholder="la-tua@email.com"
                    placeholderTextColor={Colors.placeholderInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(t) => updateForm('email', t)}
                  />
                </View>

                <Text style={commonStyles.inputLabel}>Password</Text>
                <View style={commonStyles.inputContainer}>
                  <TextInput 
                    style={commonStyles.input}
                    placeholder="Crea una password"
                    placeholderTextColor={Colors.placeholderInput} 
                    value={form.password}
                    onChangeText={(t) => updateForm('password', t)}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                    <Ionicons 
                      name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={Colors.textGray} 
                    />
                  </TouchableOpacity>
                </View>

                {/* --- DOCTOR FIELDS --- */}
                {userType === 'medico' && (
                  <>
                    <View style={localStyles.row}>
                      <View style={{ width: '65%' }}>
                        <Text style={commonStyles.inputLabel}>Indirizzo Studio</Text>
                        <View style={commonStyles.inputContainer}>
                          <TextInput 
                            style={commonStyles.input}
                            placeholder="Via Roma"
                            value={form.indirizzoStudio}
                            onChangeText={(t) => updateForm('indirizzoStudio', t)}
                          />
                        </View>
                      </View>
                      <View style={{ width: '30%' }}>
                        <Text style={commonStyles.inputLabel}>N°</Text>
                        <View style={commonStyles.inputContainer}>
                          <TextInput 
                            style={commonStyles.input}
                            placeholder="10"
                            value={form.numeroCivico}
                            onChangeText={(t) => updateForm('numeroCivico', t)}
                          />
                        </View>
                      </View>
                    </View>

                    <Text style={commonStyles.inputLabel}>Città</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="Roma"
                        value={form.citta}
                        onChangeText={(t) => updateForm('citta', t)}
                      />
                    </View>

                    <Text style={commonStyles.inputLabel}>Telefono Studio</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="06 12345678"
                        keyboardType="phone-pad"
                        value={form.telefonoStudio}
                        onChangeText={(t) => updateForm('telefonoStudio', t)}
                      />
                    </View>

                    <Text style={commonStyles.inputLabel}>Cellulare</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="333 1234567"
                        keyboardType="phone-pad"
                        value={form.telefonoCellulare}
                        onChangeText={(t) => updateForm('telefonoCellulare', t)}
                      />
                    </View>
                  </>
                )}

                {/* --- PATIENT FIELDS --- */}
                {userType === 'paziente' && (
                  <>
                    <Text style={commonStyles.inputLabel}>Codice Fiscale</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="Codice Fiscale"
                        autoCapitalize="characters"
                        value={form.codiceFiscale}
                        onChangeText={(t) => updateForm('codiceFiscale', t)}
                      />
                    </View>

                    <Text style={commonStyles.inputLabel}>Data di nascita</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="GG/MM/AAAA"
                        value={form.dataNascita}
                        onChangeText={(t) => updateForm('dataNascita', t)}
                      />
                    </View>


                    <Text style={commonStyles.inputLabel}>Medico di Riferimento</Text>
                    <View style={commonStyles.inputContainer}>
                      <TextInput 
                        style={commonStyles.input}
                        placeholder="Cerca nome..."
                        value={form.medicoRiferimento}
                        onChangeText={(t) => updateForm('medicoRiferimento', t)}
                      />
                    </View>
                  </>
                )}

                {/* BUTTON */}
                <View style={{ marginTop: 20 }}>
                  <AuthButton 
                    title="Registrati" 
                    onPress={handleRegister}
                    variant="primary"
                  />
                </View>

                {/* LOGIN LINK */}
                <View style={loginStyles.registerContainer}>
                  <Text style={loginStyles.registerText}>Hai già un account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={commonStyles.textLink}>Accedi</Text>
                  </TouchableOpacity>
                </View>

              </View> 
            </View>
          </TouchableWithoutFeedback>
          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
  },
  selectionBox: {
    width: '48%',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBox: {
    borderColor: Colors.primary || '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  boxText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  selectedBoxText: {
    color: Colors.primary || '#4A90E2',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  }
});