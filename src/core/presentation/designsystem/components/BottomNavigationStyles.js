import { StyleSheet } from 'react-native';
import Colors from '../Colors';

export const PURPLE = Colors.primary;

const FAB_SIZE = 58;
const FAB_PROTRUSION = 20; // cuánto sube el FAB sobre la barra

export const createBottomNavigationStyles = (colors = Colors.light) => StyleSheet.create({
  wrapper: {
    // El wrapper es más alto que la barra para dar espacio al FAB elevado
    backgroundColor: 'transparent',
  },
  fab: {
    position: 'absolute',
    top: 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    // Anillo blanco para simular el efecto de "bump"
    borderWidth: 3,
    borderColor: Colors.fixedWhite,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 10,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingTop: FAB_PROTRUSION + 4,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  adminNavBar: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    color: colors.iconMuted,
    textAlign: 'center',
  },
  navLabelActive: {
    color: PURPLE,
    fontWeight: '600',
  },
});

export const bottomNavigationStyles = createBottomNavigationStyles(Colors.light);
