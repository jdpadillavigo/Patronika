import { StyleSheet } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';

export const createPerfilStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 58,
  },
  profileSummary: {
    alignItems: 'center',
  },
  avatarFrame: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  username: {
    color: colors.textStrong,
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    color: colors.textStrong,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export const perfilStyles = createPerfilStyles(Colors.light);
