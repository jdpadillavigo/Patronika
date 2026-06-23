import { StyleSheet, Platform } from 'react-native';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';
 
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
  filtrarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
});
