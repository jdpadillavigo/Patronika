import { StyleSheet } from 'react-native';
import Colors from '../../../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export const createSanctionUserDeletePublicationStyles = (colors = Colors.light) => StyleSheet.create({
  reportSafeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  reportContent: {
    flex: 1,
    paddingHorizontal: 52,
    paddingTop: 18,
  },
  reportBackButton: {
    marginLeft: -32,
  },
  reportTitle: {
    color: colors.textStrong,
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 30,
  },
  reportFieldGroup: {
    marginBottom: 27,
  },
  reportLabel: {
    alignSelf: 'flex-start',
    color: colors.textStrong,
    fontSize: 15,
    fontWeight: '800',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    marginBottom: 12,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 7,
    height: 46,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  reportTextArea: {
    height: 134,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  reportErrorText: {
    color: Colors.errorDark,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -6,
    marginBottom: 16,
  },
  reportDangerButton: {
    backgroundColor: PURPLE,
    borderRadius: 7,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  reportDangerButtonText: {
    color: Colors.fixedWhite,
    fontSize: 15,
    fontWeight: '800',
  },
  reportButtonDisabled: {
    opacity: 0.65,
  },
});

export const sanctionUserDeletePublicationStyles = createSanctionUserDeletePublicationStyles(Colors.light);
