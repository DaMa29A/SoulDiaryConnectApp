import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { loginStyles } from '../styles/LoginStyles';
import { commonStyles } from '../styles/CommonStyles';
import { Colors } from '../constants/Colors';
import Logo from '../components/Logo';
import AuthButton from '../components/AuthButton';
import Footer from '../components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <StatusBar style="dark" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Logo scale={0.75}/>

            <View style={commonStyles.card}>
              <Text style={commonStyles.welcomeTitle}>Bentornato!</Text>
              <Text style={commonStyles.welcomeSub}>Accedi al tuo account per continuare</Text>

              <Text style={commonStyles.inputLabel}>Email</Text>
              <View style={commonStyles.inputContainer}>
                <TextInput 
                  style={commonStyles.input}
                  placeholder="la-tua@email.com"
                  placeholderTextColor={Colors.placeholderInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={commonStyles.inputLabel}>Password</Text>
              <View style={commonStyles.inputContainer}>
                <TextInput 
                  style={commonStyles.input}
                  placeholder="La tua password"
                  placeholderTextColor={Colors.placeholderInput} 
                  value={password}
                  onChangeText={setPassword}
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

              <View style={{ marginTop: 10 }}>
                  <AuthButton 
                    title="Accedi" 
                    onPress={() => navigation.navigate('DoctorHome')}
                    variant="primary"
                  />
              </View>

              <View style={loginStyles.registerContainer}>
                <Text style={loginStyles.registerText}>Non hai un account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={commonStyles.textLink}>Registrati</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Footer/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}