import { StyleSheet } from 'react-native';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const adminTutorialManagementStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultsCount: {
    fontSize: 13,
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#F8F8F8',
  },
  actionErrorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
  cardButton: {
    position: 'relative',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 28,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  formSafeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContent: {
    flexGrow: 1,
    paddingHorizontal: 52,
    paddingTop: 18,
    paddingBottom: 42,
  },
  formErrorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  formLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: PURPLE,
    borderRadius: 7,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
  },
});
