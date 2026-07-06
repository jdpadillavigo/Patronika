import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';
import { PURPLE, createRecuperarBase } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

export const createOlvidasteStyles = (colors = Colors.light) => StyleSheet.create({
  ...createRecuperarBase(colors),
  // Input con solo linea inferior.
  input: {
    fontSize: 15,
    color: colors.textHeading,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputUnderline,
    marginBottom: 8,
  },
});

export const olvidasteStyles = createOlvidasteStyles(Colors.light);
