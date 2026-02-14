import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';


export const loginStyles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: Colors.textGray,
    fontSize: 14,
  }
});