import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import { PURPLE, createRecuperarBase } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export const createVerificarCorreoStyles = (colors = Colors.light) => StyleSheet.create({
  ...createRecuperarBase(colors),
  descripcion: {
    ...createRecuperarBase(colors).descripcion,
    width: '100%',
  },
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
    borderBottomColor: colors.inputUnderline,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textHeading,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textHeading,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  modalBoton: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalBotonText: {
    color: Colors.fixedWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});

export const verificarCorreoStyles = createVerificarCorreoStyles(Colors.light);
