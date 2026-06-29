import { StyleSheet } from 'react-native';
import { PURPLE } from './CommonStyles';

export { PURPLE } from './CommonStyles';

export const userPreviewModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
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
    backgroundColor: '#F3EDF4',
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
    color: '#1A1A1A',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    maxWidth: '100%',
  },
  email: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
