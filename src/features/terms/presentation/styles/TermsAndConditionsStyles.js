import { StyleSheet } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const createTermsAndConditionsStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 44,
  },
  updatedAt: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  updatedAtBold: {
    fontWeight: '800',
  },
  paragraph: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 14,
  },
});

export const termsAndConditionsStyles = createTermsAndConditionsStyles(Colors.light);
