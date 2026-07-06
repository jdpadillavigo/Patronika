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
    paddingHorizontal: 58,
    paddingTop: 78,
    paddingBottom: 40,
  },
  profileSummary: {
    alignItems: 'center',
  },
  avatarFrame: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 18,
  },
  avatarImage: {
    width: 192,
    height: 192,
    borderRadius: 96,
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
  actions: {
    marginTop: 72,
  },
});

export const perfilStyles = createPerfilStyles(Colors.light);
