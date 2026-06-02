import { StyleSheet, Platform } from 'react-native';
import { PURPLE } from './CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from './CommonStyles';

export const misPatronesStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
  },
  tabTextActivo: {
    color: PURPLE,
    fontWeight: 'bold',
  },
  tabIndicador: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 2.5,
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  contenido: {
    flex: 1,
    backgroundColor: 'white',
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacioText: {
    fontSize: 15,
    color: '#999',
  },
  listaPatrones: {
    padding: 16,
    gap: 16,
  },
  cardPatron: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardImagen: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3EDF4',
  },
  cardInfo: {
    backgroundColor: PURPLE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cardCreador: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardValoracion: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  cardDificultad: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
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
  navCenter: {
    width: 72,
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
  navLabelActivo: {
    color: PURPLE,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -31,
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

