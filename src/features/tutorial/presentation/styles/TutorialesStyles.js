import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../../core/presentation/designsystem/Colors';

export const PURPLE = Colors.primary;

const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_HEIGHT = (SCREEN_WIDTH - 32) * (9 / 16);

export const createTutorialesStyles = (colors = Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  headerTitle: {
    color: Colors.fixedWhite,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: Colors.whiteAlpha75,
    fontSize: 13,
    marginTop: 2,
  },

  // Lista
  list: {
    padding: 16,
    paddingBottom: 16,
    gap: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 16,
  },

  // Tarjeta de tutorial
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
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
    backgroundColor: colors.textStrong,
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
    backgroundColor: Colors.fixedBlack,
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlaySoft,
  },

  // Contenido de la tarjeta
  cardContent: {
    padding: 14,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textMuted,
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
    color: colors.textSubtle,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textDisabled,
  },
});

export const tutorialesStyles = createTutorialesStyles(Colors.light);
