import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import { PURPLE, DARK_BG } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export const createLoginStyles = (colors = Colors.light) => StyleSheet.create({
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
    color: Colors.fixedWhite,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.whiteAlpha70,
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
    borderBottomColor: Colors.whiteAlpha35,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.fixedWhite,
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
    backgroundColor: Colors.primaryAlpha45,
  },
  buttonText: {
    color: Colors.fixedWhite,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkCenter: {
    alignItems: 'center',
  },
  linkText: {
    color: Colors.whiteAlpha65,
    fontSize: 14,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  bottomText: {
    color: Colors.whiteAlpha65,
    fontSize: 14,
  },
  bottomLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export const loginStyles = createLoginStyles(Colors.light);
