import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { commonStyles } from '../styles/CommonStyles';
import Logo from '../components/logos/Logo';
import AuthButton from '../components/buttons/AuthButton';
import { Colors } from '../constants/Colors';
import Footer from '../components/Footer';

type Props = NativeStackScreenProps<RootStackParamList, 'Index'>;

export default function IndexScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={commonStyles.container_not_log}>
        <View style={[commonStyles.page, {gap: 10}]}>
            <Logo />
            <Text style={styles.tagline}>
                Il diario digitale, sempre al tuo fianco
            </Text>
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
        <Footer />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    tagline: {
        fontSize: 16,
        color: Colors.textGray,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 24,
        marginBottom: 10
  },
});