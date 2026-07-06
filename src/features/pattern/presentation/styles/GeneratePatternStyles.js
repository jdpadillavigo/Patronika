import { StyleSheet } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { PURPLE, DARK_BANNER } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const createGenerarPatronStyles = (colors = Colors.light) => StyleSheet.create({
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.fixedWhite,
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  banner: {
    backgroundColor: DARK_BANNER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  bannerText: {
    color: Colors.fixedWhite,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PURPLE,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: PURPLE,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.avatarBadgeBorder,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    color: PURPLE,
    fontSize: 14,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.disabledButtonBackground,
  },
  buttonText: {
    color: Colors.fixedWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayStrong,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.textStrong,
    lineHeight: 30,
  },
});

export const generarPatronStyles = createGenerarPatronStyles(Colors.light);
