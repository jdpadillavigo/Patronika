import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import { PURPLE, DARK_BG } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../../core/presentation/designsystem/components/CommonStyles';

export const createRegistroStyles = (colors = Colors.light) => StyleSheet.create({
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
    paddingTop: 48,
    paddingBottom: 40,
  },
  titleGroup: {
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.fixedWhite,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.whiteAlpha70,
    lineHeight: 20,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.textDisabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.avatarBadgeBorder,
  },
  form: {
    gap: 22,
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
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: Colors.whiteAlpha50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkLabel: {
    color: Colors.whiteAlpha70,
    fontSize: 14,
  },
  checkLabelLink: {
    textDecorationLine: 'underline',
    color: Colors.fixedWhite,
  },
  fieldError: {
    color: Colors.errorSoft,
    fontSize: 13,
    marginTop: -14,
  },
  formError: {
    color: Colors.errorSoft,
    fontSize: 13,
    textAlign: 'center',
    marginTop: -8,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryAlpha45,
  },
  buttonText: {
    color: Colors.fixedWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 28,
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

export const registroStyles = createRegistroStyles(Colors.light);
