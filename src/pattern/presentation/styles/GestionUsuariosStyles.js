import { StyleSheet, Platform } from 'react-native';
import { PURPLE } from './CommonStyles';
 
export const gestionUsuariosStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
 
  // Header morado — mismo patrón que MisPatronesScreen
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
 
  // Contenido / lista
  listContent: {
    padding: 16,
    gap: 12,
  },
 
  // Card de cada usuario
  userCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  userCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1E6F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarInitial: {
    color: PURPLE,
    fontWeight: '700',
    fontSize: 18,
  },
  userNameBlock: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 1,
  },
 
  // Badges (rol y estado)
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeAdmin: {
    backgroundColor: '#F1E6F2',
  },
  badgeAdminText: {
    color: PURPLE,
  },
  badgeUser: {
    backgroundColor: '#EEF1F4',
  },
  badgeUserText: {
    color: '#555',
  },
  badgeActive: {
    backgroundColor: '#E6F7EC',
  },
  badgeActiveText: {
    color: '#1F9254',
  },
  badgeSuspended: {
    backgroundColor: '#FCEAEA',
  },
  badgeSuspendedText: {
    color: '#C0392B',
  },
 
  // Pie de la card — fecha de registro + estadísticas de actividad
  userCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerStat: {
    alignItems: 'center',
    flex: 1,
  },
  footerStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  footerStatLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
 
  // Estados: cargando / vacío / error
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
 
  // Acceso denegado (usuario no admin)
  deniedIcon: {
    marginBottom: 12,
  },
  deniedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  deniedText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});