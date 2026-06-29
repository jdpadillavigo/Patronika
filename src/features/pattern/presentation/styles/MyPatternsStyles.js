import { StyleSheet, Platform, Dimensions } from 'react-native';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';

export { PURPLE, DARK_BG, DARK_BANNER, AUTH_GRADIENTS, absoluteFill } from '../../../../core/presentation/designsystem/components/CommonStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 12;
const GRID_GAP = 8;
export const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

export const misPatronesStyles = StyleSheet.create({
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

  // --- Filtros ---
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filtroGrid: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F3EDF4',
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
    backgroundColor: '#F0F0F0',
  },
  filtroPillActivo: {
    backgroundColor: PURPLE,
  },
  filtroPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  filtroPillTextActivo: {
    color: 'white',
  },

  // --- Estado vacío / loading ---
  contenido: {
    flex: 1,
  },
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  vacioText: {
    fontSize: 15,
    color: '#999',
  },

  // --- Grid Pinterest ---
  gridScroll: {
    flex: 1,
  },
  gridContainer: {
    padding: GRID_PADDING,
    paddingBottom: 100,
  },
  gridColumns: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },
  gridColumn: {
    flex: 1,
    gap: GRID_GAP,
  },
  gridCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  gridCardImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#F3EDF4',
  },
  gridCardImg: {
    width: '100%',
    height: '100%',
  },
  gridCardPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EDF4',
  },
  gridCardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: PURPLE,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardPublishedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: PURPLE,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardFooter: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: 'white',
  },
  gridCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  // --- Modal detalle (bottom sheet) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalPreview: {
    width: '100%',
    height: SCREEN_WIDTH * 0.55,
    borderRadius: 12,
    backgroundColor: '#F3EDF4',
    marginBottom: 20,
  },
  modalPreviewPlaceholder: {
    width: '100%',
    height: SCREEN_WIDTH * 0.55,
    borderRadius: 12,
    backgroundColor: '#F3EDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalActions: {
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F5F0F5',
  },
  actionBtnDanger: {
    backgroundColor: '#FFF0F0',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: PURPLE,
  },
  actionBtnTextDanger: {
    color: '#E53935',
  },

  // --- Fullscreen ---
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
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
