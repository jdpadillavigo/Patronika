import { StyleSheet, Platform } from 'react-native';
import { PURPLE } from './CommonStyles';

export { PURPLE } from './CommonStyles';

export const termsAndConditionsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
    paddingTop: Platform.OS === 'android' ? 42 : 12,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    minHeight: 28,
  },
  backText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: '#222',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 44,
  },
  updatedAt: {
    color: '#2A2A2A',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  updatedAtBold: {
    fontWeight: '800',
  },
  paragraph: {
    color: '#2A2A2A',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 22,
  },
  sectionTitle: {
    color: '#2A2A2A',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 14,
  },
});
