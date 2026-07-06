import { StyleSheet } from 'react-native';
import Colors from '../Colors';
import { PURPLE } from './CommonStyles';

export { PURPLE } from './CommonStyles';

export const createUserPreviewModalStyles = (colors = Colors.light) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  roleText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  avatarFrame: {
    width: 166,
    height: 166,
    borderRadius: 83,
    borderWidth: 3,
    borderColor: PURPLE,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  username: {
    color: colors.textHeading,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    maxWidth: '100%',
  },
  email: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export const userPreviewModalStyles = createUserPreviewModalStyles(Colors.light);
