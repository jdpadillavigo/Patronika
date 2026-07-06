import { StyleSheet } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const createFormularioStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.fixedWhite,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textStrong,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: colors.textStrong,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.stepperButtonBackground,
  },
  stepperSymbol: {
    fontSize: 22,
    color: PURPLE,
    fontWeight: 'bold',
  },
  stepperDisabled: {
    color: colors.textDisabled,
  },
  stepperInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textStrong,
    height: 52,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.disabledButtonBackground,
  },
  buttonText: {
    color: Colors.fixedWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayStrong,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textStrong,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
  },
  infoTextGroup: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textStrong,
  },
  infoDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  modalBtn: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 4,
  },
  modalBtnText: {
    color: Colors.fixedWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export const formularioStyles = createFormularioStyles(Colors.light);
