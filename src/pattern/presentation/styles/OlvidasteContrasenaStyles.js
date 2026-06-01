import { StyleSheet, Platform } from 'react-native';
import { PURPLE, recuperarBase } from './CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from './CommonStyles';

export const olvidasteStyles = StyleSheet.create({
  ...recuperarBase,
  // Input con solo linea inferior.
  input: {
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
    marginBottom: 8,
  },
});
