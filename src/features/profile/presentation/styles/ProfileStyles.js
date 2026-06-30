import { StyleSheet } from 'react-native';

export const perfilStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
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
    backgroundColor: '#CFCFCF',
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
    color: '#111',
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    color: '#111',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  actions: {
    marginTop: 72,
  },
});
