import { StyleSheet } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const createVistaPreviaStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    color: Colors.fixedWhite,
    fontSize: 26,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 40,
  },
  patternContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PURPLE,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  patternPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  placeholderText: {
    color: PURPLE,
    fontSize: 14,
  },
  buttons: {
    width: '100%',
    gap: 14,
  },
  buttonSolid: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonSolidText: {
    color: Colors.fixedWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export const vistaPreviaStyles = createVistaPreviaStyles(Colors.light);
