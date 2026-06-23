import { StyleSheet, Platform } from 'react-native';

export const PURPLE = '#7B3F7E';
export const DARK_BG = '#1A0B08';
export const DARK_BANNER = '#1C1C1E';

export const AUTH_GRADIENTS = [
  ['#3D1547', '#1A0B08', '#2C0D3A'],
  ['#1C0B2E', '#4A1259', '#0D0518'],
  ['#2C1654', '#1A0B08', '#3D1050'],
];

export const absoluteFill = StyleSheet.absoluteFill;

export const recuperarBase = {
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  volverBtn: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  volverText: {
    color: PURPLE,
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
    color: '#1A1A1A',
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 36,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  boton: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    elevation: 3,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  botonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
};
