import { StyleSheet, Platform } from 'react-native';
import { PURPLE, DARK_BG } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export const loginStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  titleGroup: {
    gap: 8,
    marginBottom: 48,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    flex: 1,
    gap: 28,
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.35)',
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 4,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(123,63,126,0.45)',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkCenter: {
    alignItems: 'center',
  },
  linkText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  bottomText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  bottomLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

