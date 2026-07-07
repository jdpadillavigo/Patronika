import { StyleSheet } from 'react-native';
import Colors from '../../../../../../core/presentation/designsystem/Colors';
import { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE } from '../../../../../../core/presentation/designsystem/components/CommonStyles';

export const createAdminCommunityManagementStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    height: 42,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 2,
    backgroundColor: PURPLE,
  },
  tabText: {
    color: colors.textStrong,
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: PURPLE,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 1,
  },
  filtroGrid: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroGridActivo: {
    backgroundColor: PURPLE,
  },
  filtroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.borderSoft,
  },
  filtroPillActivo: {
    backgroundColor: PURPLE,
  },
  filtroPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filtroPillTextActivo: {
    color: Colors.fixedWhite,
  },
  body: {
    flex: 1,
    backgroundColor: colors.inputBackground,
  },
});

export const adminCommunityManagementStyles = createAdminCommunityManagementStyles(Colors.light);
