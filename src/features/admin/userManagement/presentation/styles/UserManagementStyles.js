import { StyleSheet, Platform } from 'react-native';
import { PURPLE } from '../../../../../core/presentation/designsystem/components/CommonStyles';
 
export const gestionUsuariosStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
 
  // Header morado — mismo patrón que MisPatronesScreen
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
 
// Barra de búsqueda dentro del header morado
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 14,
    color: '#333',
  },
 
  // Contador de resultados 
  resultsCount: {
    fontSize: 13,
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  actionErrorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
 
  // Lista
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
 
  // Card de cada usuario
  userCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderWidth: 2,
    borderColor: PURPLE,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  moreButton: {
    padding: 4,
  },
  userEmailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12.5,
    color: '#777',
  },
  userId: {
    fontSize: 12,
    color: '#999',
  },
  userMetaRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  userMetaText: {
    fontSize: 12.5,
    color: '#555',
  },
  userMetaSeparator: {
    fontSize: 12.5,
    color: '#CCC',
    marginHorizontal: 6,
  },
  userDateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  rolAdminText: {
    color: PURPLE,
    fontWeight: '700',
  },
  estadoActivoText: {
    color: '#1F9254',
    fontWeight: '600',
  },
  estadoSuspendidoText: {
    color: '#C0392B',
    fontWeight: '600',
  },
 
  // ── Overlay de acciones (editar / estado / eliminar) ──────────────────────
  // Reemplaza visualmente la card seleccionada — mismo tamaño y posición,
  // con 3 botones circulares centrados y una X para cerrar.
  actionsOverlay: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    position: 'relative',
  },
  closeOverlayButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    zIndex: 5,
  },
  overlayAction: {
    alignItems: 'center',
    gap: 6,
  },
  overlayIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayActionLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
 
  // ── Estados: cargando / vacío / error / acceso denegado ───────────────────
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  centerStateText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  deniedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    marginTop: 12,
  },
  deniedText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  deleteModalCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  deleteModalIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  deleteModalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  deleteCancelButton: {
    flex: 1,
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteCancelButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteConfirmButtonText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
  editSafeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  editContent: {
    flex: 1,
    paddingHorizontal: 52,
    paddingTop: 18,
  },
  editBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: -10,
    marginBottom: 26,
  },
  editBackText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
  editTitle: {
    color: '#262626',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 28,
  },
  editFieldGroup: {
    marginBottom: 26,
  },
  editLabel: {
    alignSelf: 'flex-start',
    color: '#111',
    fontSize: 15,
    fontWeight: '800',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 7,
    minHeight: 46,
    paddingHorizontal: 14,
    color: '#333',
    fontSize: 15,
  },
  editSelectButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 7,
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editSelectText: {
    color: '#333',
    fontSize: 15,
  },
  editSaveButton: {
    backgroundColor: PURPLE,
    borderRadius: 7,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },
  editSaveButtonDisabled: {
    opacity: 0.65,
  },
  editSaveButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
  },
  editErrorText: {
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 18,
  },
  editLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 52,
  },
  statusModalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  statusOption: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusOptionText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
});
