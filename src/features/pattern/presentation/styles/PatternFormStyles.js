import { StyleSheet } from 'react-native';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const formularioStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PURPLE,
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
    fontWeight: 'bold',
    color: '#111',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: '#111',
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
    backgroundColor: '#f5eef6',
  },
  stepperSymbol: {
    fontSize: 22,
    color: PURPLE,
    fontWeight: 'bold',
  },
  stepperDisabled: {
    color: '#ccc',
  },
  stepperInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
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
    backgroundColor: '#b89aba',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
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
    color: '#111',
  },
  infoDesc: {
    fontSize: 13,
    color: '#555',
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
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

