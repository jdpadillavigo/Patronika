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
  },
  patternSeparator: {
    height: 16,
  },
  listFooter: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
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
  cardImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    backgroundColor: PURPLE,
    height: 86,
    paddingHorizontal: 16,
    paddingVertical: 12,
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

  downloadButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(123, 63, 126, 0.85)', // morado semitransparente, igual al PURPLE
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10, // asegura que quede encima de la imagen
  },
});

