import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { indexStyles } from '../styles/IndexStyles';
import { commonStyles } from '../styles/CommonStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AuthButton from '../components/AuthButton';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'Index'>;

export default function IndexScreen({ navigation }: Props) {
  return (
    <View style={commonStyles.container}>
      <StatusBar style="dark" />

      <View style={indexStyles.contentContainer}>
        
        {/* Header */}
        <Logo />

        <Text style={indexStyles.tagline}>
          Il diario digitale, sempre al tuo fianco.
        </Text>

        {/* Buttons */}
        <View style={indexStyles.buttonsContainer}>
          <AuthButton
            title="Accedi"
            variant="primary"
            iconName="log-in-outline"
            onPress={() => navigation.navigate('Login')}
          />

          <AuthButton
            title="Registrati"
            variant="outline"
            iconName="person-add-outline"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </View>

      {/* Footer */}
      <Footer/>

    </View>
  );
}