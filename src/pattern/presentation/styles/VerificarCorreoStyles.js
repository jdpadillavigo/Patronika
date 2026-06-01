import { StyleSheet, Platform } from 'react-native';
import { PURPLE, recuperarBase } from './CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from './CommonStyles';

export const verificarCorreoStyles = StyleSheet.create({
  ...recuperarBase,
  // Casillas separadas para el codigo OTP.
  codigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  codigoCasilla: {
    flex: 1,
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: '#BDBDBD',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  reenviarText: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
