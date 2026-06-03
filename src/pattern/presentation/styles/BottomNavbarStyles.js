import { StyleSheet, Platform } from 'react-native';
import { PURPLE } from './CommonStyles';

export { PURPLE } from './CommonStyles';

export const bottomNavbarStyles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingBottom: Platform.OS === 'ios' ? 18 : 25,
    paddingTop: 8,
    paddingHorizontal: 8,
    position: 'relative',
  },
  navLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#AAA',
  },
  navLabelActive: {
    color: PURPLE,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: Platform.OS === 'ios' ? 22 : 10,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
