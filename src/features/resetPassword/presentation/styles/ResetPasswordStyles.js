import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { PURPLE, createRecuperarBase } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const createRestablecerStyles = (colors = Colors.light) => StyleSheet.create({
  ...createRecuperarBase(colors),
  // Fila con input y boton para mostrar/ocultar.
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.inputUnderline,
    marginBottom: 20,
  },
  botonDisabled: {
    opacity: 0.65,
  },
  // Modal overlay oscuro
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  // Tarjeta blanca del modal
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
  // Contenedor del icono con badge de refresh.
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalIconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 2,
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

export const restablecerStyles = createRestablecerStyles(Colors.light);
