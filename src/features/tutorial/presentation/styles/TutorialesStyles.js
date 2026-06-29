import { StyleSheet, Dimensions } from 'react-native';

export const PURPLE = '#763A6C';

const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_HEIGHT = (SCREEN_WIDTH - 32) * (9 / 16);

export const tutorialesStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 2,
  },

  // Lista
  list: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },

  // Tarjeta de tutorial
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    zIndex: 8,
  },

  // Miniatura del video
  thumbnail: {
    width: '100%',
    height: THUMBNAIL_HEIGHT,
    backgroundColor: '#111',
  },
  thumbnailTouchable: {
    width: '100%',
    height: '100%',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Contenido de la tarjeta
  cardContent: {
    padding: 14,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  cardDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },

  // Estado vacío / loading
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
  },
});
