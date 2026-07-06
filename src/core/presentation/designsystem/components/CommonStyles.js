import { StyleSheet, Platform } from 'react-native';
import Colors from '../Colors';

export const PURPLE = Colors.primaryAlt;
export const DARK_BG = Colors.authDarkBackground;
export const DARK_BANNER = Colors.authDarkBanner;
export const REFRESH_TOP_BAR_OFFSET = -2;
export const REFRESH_ADMIN_LIST_OFFSET = -38;

export const AUTH_GRADIENTS = [
  [Colors.authGradientStart, Colors.authDarkBackground, Colors.authGradientMiddle],
  [Colors.authGradientDeep, Colors.authGradientAccent, Colors.authGradientEnd],
  [Colors.authGradientBlue, Colors.authDarkBackground, Colors.authGradientPurple],
];

export const absoluteFill = StyleSheet.absoluteFill;

export const createRecuperarBase = (colors = Colors.light) => ({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  volverBtn: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  volverText: {
    color: Colors.primaryAlt,
    fontSize: 15,
    fontWeight: '500',
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  titulo: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textHeading,
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  descripcion: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 36,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textHeading,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  boton: {
    backgroundColor: Colors.primaryAlt,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    elevation: 3,
    shadowColor: Colors.primaryAlt,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  botonText: {
    color: Colors.fixedWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export const recuperarBase = createRecuperarBase(Colors.light);
