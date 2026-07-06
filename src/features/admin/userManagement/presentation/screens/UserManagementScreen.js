import React, { useState, useCallback, useMemo } from 'react';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../../core/presentation/designsystem/Theme';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminBottomNavigationItem } from '../../../../../core/domain/BottomNavigationItem';
import AppTopBar from '../../../../../core/presentation/designsystem/components/AppTopBar';
import { PURPLE, REFRESH_ADMIN_LIST_OFFSET } from '../../../../../core/presentation/designsystem/components/CommonStyles';
import FloatingIconButton from '../../../../../core/presentation/designsystem/components/FloatingIconButton';
import ScreenState from '../../../../../core/presentation/designsystem/components/ScreenState';
import { createGestionUsuariosStyles, gestionUsuariosStyles as styles } from '../styles/UserManagementStyles';
let themedStyles = styles;
import UserManagementUseCase from '../../domain/usecases/UserManagementUseCase';
import ProfileUseCase from '../../../../profile/domain/usecases/ProfileUseCase';
import AdminBottomBar from '../../../../../core/presentation/designsystem/components/AdminBottomBar';
import UserPreviewModal from '../../../../../core/presentation/designsystem/components/UserPreviewModal';
 
// Formatea la fecha de registro a un formato legible (DD/MM/AAAA)
function formatFecha(fechaIso) {
  if (!fechaIso) return 'Sin fecha';
  try {
    const date = new Date(fechaIso);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return 'Sin fecha';
  }
}

// Card individual de cada usuario en el listado
function UserCard({ user, isOwnAccount, isMenuOpen, onToggleMenu, onCloseMenu, onEdit, onToggleStatus, onDelete, onOpenUser }) {
  const isActive = user.status === 0; // status 0 = activo, otro valor = suspendido (igual que en PerfilScreen/User.ts)
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showAvatar = !!user.profileImageUrl && !avatarFailed;
 
  if(isMenuOpen && !isOwnAccount) {
    return (
    <View style={themedStyles.actionsOverlay}>
        <TouchableOpacity style={themedStyles.closeOverlayButton} onPress={onCloseMenu}>
          <Ionicons name="close" size={16} color={Colors.fixedWhite} />
        </TouchableOpacity>

        {/* Acciones del usuario seleccionado */}
        <TouchableOpacity style={themedStyles.overlayAction} onPress={onEdit} activeOpacity={0.8}>
          <View style={themedStyles.overlayIconCircle}>
            <Ionicons name="pencil" size={22} color={Colors.fixedWhite} />
          </View>
          <Text style={themedStyles.overlayActionLabel} numberOfLines={1}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={themedStyles.overlayAction} onPress={onToggleStatus} activeOpacity={0.8}>
          <View style={themedStyles.overlayIconCircle}>
            <Ionicons name={isActive ? 'happy' : 'skull'} size={22} color={Colors.fixedWhite} />
          </View>
          <Text style={themedStyles.overlayActionLabel} numberOfLines={1}>Estado: {isActive ? 'Activo' : 'Suspendido'}</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={themedStyles.overlayAction} onPress={onDelete} activeOpacity={0.8}>
          <View style={themedStyles.overlayIconCircle}>
            <Ionicons name="trash" size={22} color={Colors.fixedWhite} />
          </View>
          <Text style={themedStyles.overlayActionLabel} numberOfLines={1}>Eliminar</Text>
        </TouchableOpacity>
      </View>
  );
}
return (
    <View style={themedStyles.userCard}>
      <TouchableOpacity onPress={() => onOpenUser(user)} activeOpacity={0.78}>
        {showAvatar ? (
          <Image
            source={{ uri: user.profileImageUrl }}
            style={themedStyles.avatarImage}
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <View style={themedStyles.avatarPlaceholder}>
            <Ionicons name="person" size={26} color={PURPLE} />
          </View>
        )}
      </TouchableOpacity>
 
      <View style={themedStyles.userInfo}>
        <View style={themedStyles.userTopRow}>
          <Text style={themedStyles.userName} numberOfLines={1}>{user.username}</Text>
          {!isOwnAccount ? (
            <TouchableOpacity style={themedStyles.moreButton} onPress={onToggleMenu}>
              <Ionicons name="ellipsis-vertical" size={18} color={PURPLE} />
            </TouchableOpacity>
          ) : null}
        </View>
 
        <View style={themedStyles.userEmailRow}>
          <Text style={themedStyles.userEmail} numberOfLines={1}>{user.email}</Text>
        </View>
 
        <View style={themedStyles.userMetaRow}>
          <Text style={[themedStyles.userMetaText, user.isAdmin && themedStyles.rolAdminText]}>
            Rol: {user.isAdmin ? 'Admin' : 'Usuario'}
          </Text>
          <Text style={themedStyles.userMetaSeparator}>|</Text>
          <Text style={[themedStyles.userMetaText, isActive ? themedStyles.estadoActivoText : themedStyles.estadoSuspendidoText]}>
            Estado: {isActive ? 'Activo' : 'Suspendido'}
          </Text>
        </View>
 
        <Text style={themedStyles.userDateText}>Fecha de registro: {formatFecha(user.registeredDate)}</Text>
      </View>
    </View>
  );
}
 
export default function GestionUsuariosScreen({navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createGestionUsuariosStyles(colors), [colors]);
  themedStyles = styles;
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [esAdmin, setEsAdmin] = useState(null); // null = aún verificando, true/false = resultado
  const [busqueda, setBusqueda] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [statusCandidate, setStatusCandidate] = useState(null);
  const [reactivateCandidate, setReactivateCandidate] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [suspensionDays, setSuspensionDays] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [menuAbiertoId, setMenuAbiertoId] = useState(null); // id del usuario cuyo menú overlay está abierto
 
  // Verifica el rol del usuario actual antes de mostrar el listado (criterio de aceptación #3)
  const verificarAccesoYCargar = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    setActionError('');
 
    const currentUser = await ProfileUseCase.getCurrent().catch(() => null);
    setCurrentUserId(currentUser?.id || null);
    if (!currentUser?.isAdmin) {
      setEsAdmin(false);
      setRefreshing(false);
      setLoading(false);
      return;
    }
    setEsAdmin(true);
    

    const result = await UserManagementUseCase.getAllUsers();
    if (!result.success) {
      setError('No se pudieron cargar los usuarios. Revisa tu conexión e inténtalo nuevamente.');
      setUsuarios([]);
    } else {
      setUsuarios(result.data || []);
    }
    setRefreshing(false);
    setLoading(false);
  }, []);

  const handleRefresh = useCallback(() => {
    verificarAccesoYCargar(true);
  }, [verificarAccesoYCargar]);
 
  useFocusEffect(useCallback(() => {
    verificarAccesoYCargar();
  }, [verificarAccesoYCargar]));

  const usuariosFiltrados = useMemo (() => {
    const query = busqueda.trim().toLowerCase();
    return usuarios.filter(u => {
      const matchesSearch = !query
        || u.username?.toLowerCase().includes(query)
        || u.email?.toLowerCase().includes(query);
      const matchesFilter = activeFilter === 'todos' || u.status !== 0;
      return matchesSearch && matchesFilter;
    });
  }, [usuarios, busqueda, activeFilter] );

  const updateUserInList = useCallback((updatedUser) => {
    setUsuarios(current => current.map(user => (
      (user.id || user.email) === (updatedUser.id || updatedUser.email) ? updatedUser : user
    )));
  }, []);

  const handleEditUser = useCallback((user) => {
    setMenuAbiertoId(null);
    navigation.navigate('EditarUsuarioAdmin', { userId: user.id });
  }, [navigation]);

  const handleAskToggleStatus = useCallback((user) => {
    setActionError('');
    if (user.status === 0) {
      setStatusCandidate(user);
    } else {
      setReactivateCandidate(user);
    }
    setSuspensionDays('');
    setSuspensionReason('');
  }, []);

  const handleToggleStatus = useCallback(async () => {
    const user = statusCandidate || reactivateCandidate;
    if (!user) return;

    const shouldSuspend = user.status === 0;
    if (shouldSuspend) {
      const days = Number.parseInt(suspensionDays, 10);
      if (!Number.isInteger(days) || days <= 0) {
        setActionError('Ingresa una cantidad de días válida para suspender.');
        return;
      }
      if (!suspensionReason.trim()) {
        setActionError('Ingresa el motivo de suspensión.');
        return;
      }
    }

    setStatusLoading(true);
    setActionError('');
    const nextStatus = user.status === 0 ? 1 : 0;
    const suspensionDraft = shouldSuspend ? {
      days: Number.parseInt(suspensionDays, 10),
      reason: suspensionReason.trim(),
    } : null;
    const result = await UserManagementUseCase.updateUserStatus(user, nextStatus, suspensionDraft);
    setStatusLoading(false);
    if (!result.success) {
      if (result.sessionExpired) return;
      setActionError('No se pudo completar la acción. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }
    updateUserInList(result.data || { ...user, status: nextStatus });
    setMenuAbiertoId(null);
    setStatusCandidate(null);
    setReactivateCandidate(null);
  }, [statusCandidate, reactivateCandidate, suspensionDays, suspensionReason, updateUserInList]);

  const handleAskDelete = useCallback((user) => {
    setActionError('');
    setMenuAbiertoId(null);
    setDeleteCandidate(user);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteCandidate) return;
    setDeleteLoading(true);
    setActionError('');
    const result = await UserManagementUseCase.deleteUser(deleteCandidate);
    setDeleteLoading(false);
    if (!result.success) {
      if (result.sessionExpired) return;
      setActionError('No se pudo eliminar el usuario. Revisa tu conexión e inténtalo nuevamente.');
      setDeleteCandidate(null);
      return;
    }

    setUsuarios(current => current.filter(user => (user.id || user.email) !== (deleteCandidate.id || deleteCandidate.email)));
    setMenuAbiertoId(null);
    setDeleteCandidate(null);
  }, [deleteCandidate]);
 
  // ── Acceso denegado (criterio de aceptación #3) ──────────────────────────
  if (esAdmin === false) {
    return (
      <View style={styles.safeArea}>
        <AppTopBar subtitle="Gestión de Usuarios" />
        <View style={styles.centerState}>
          <Ionicons name="lock-closed-outline" size={48} color={colors.textDisabled} />
          <Text style={styles.deniedTitle}>Acceso restringido</Text>
          <Text style={styles.deniedText}>Esta sección solo está disponible para administradores.</Text>
        </View>
      </View>
    );
  }
 
  return (
    <View style={styles.safeArea}>
      <AppTopBar subtitle="Gestión de Usuarios" />

      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar.."
            placeholderTextColor={colors.placeholder}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCapitalize="none"
            maxLength={80}
          />
        </View>
      </View>

      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[styles.filtroGrid, activeFilter === 'todos' && styles.filtroGridActivo]}
          onPress={() => setActiveFilter('todos')}
          activeOpacity={0.8}
        >
          <Ionicons name="people" size={18} color={activeFilter === 'todos' ? Colors.fixedWhite : PURPLE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroPill, activeFilter === 'suspendidos' && styles.filtroPillActivo]}
          onPress={() => setActiveFilter('suspendidos')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="gavel" size={14} color={activeFilter === 'suspendidos' ? Colors.fixedWhite : colors.textSecondary} />
          <Text style={[styles.filtroPillText, activeFilter === 'suspendidos' && styles.filtroPillTextActivo]}>
            Suspendidos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estado: cargando */}
      {loading && (
        <ScreenState loading text="Cargando usuarios..." />
      )}
 
      {/* Estado: error (criterio de aceptación #4) */}
      {!loading && error ? (
        <ScreenState
          iconName="cloud-offline-outline"
          text={error}
          actionText="Reintentar"
          onAction={verificarAccesoYCargar}
        />
      ) : null}
 
      {/* Estado: listado vacío (criterio de aceptación #4) */}
      {!loading && !error && (
        <>
          <Text style={styles.resultsCount}>
            Mostrando {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? 'resultado' : 'resultados'}
          </Text>
          {actionError ? <Text style={styles.actionErrorText}>{actionError}</Text> : null}
 
          {usuariosFiltrados.length === 0 ? (
            <FlatList
              data={[]}
              keyExtractor={item => item.id || item.email}
              ListEmptyComponent={<ScreenState iconName="people-outline" text="No se encontraron usuarios" />}
              contentContainerStyle={styles.emptyListContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_ADMIN_LIST_OFFSET} />}
            />
          ) : (
            <FlatList
              data={usuariosFiltrados}
              keyExtractor={item => item.id || item.email}
              renderItem={({ item }) => (
                <UserCard
                  user={item}
                  isOwnAccount={!!currentUserId && item.id === currentUserId}
                  isMenuOpen={menuAbiertoId === (item.id || item.email)}
                  onToggleMenu={() => setMenuAbiertoId(item.id || item.email)}
                  onCloseMenu={() => setMenuAbiertoId(null)}
                  onEdit={() => handleEditUser(item)}
                  onToggleStatus={() => handleAskToggleStatus(item)}
                  onDelete={() => handleAskDelete(item)}
                  onOpenUser={setSelectedUser}
                />
              )}
              contentContainerStyle={styles.listContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_ADMIN_LIST_OFFSET} />}
            />
          )}
        </>
      )}
 
      {/* Barra inferior tipo admin — sin botón de cámara */}
      <AdminBottomBar
        activeItem={AdminBottomNavigationItem.USERS}
        onPressUsers={() => {}}
        onPressCommunity={() => navigation.navigate('GestionComunidadAdmin')}
        onPressTutorials={() => navigation.navigate('GestionTutorialesAdmin')}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: true })}
      />

      {!loading && !error && esAdmin === true ? (
        <FloatingIconButton
          label="Agregar usuario"
          onPress={() => navigation.navigate('AgregarUsuarioAdmin')}
        />
      ) : null}

      <Modal
        visible={!!deleteCandidate}
        transparent
        animationType="fade"
        onRequestClose={() => !deleteLoading && setDeleteCandidate(null)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIcon}>
              <Ionicons name="trash" size={30} color={PURPLE} />
            </View>
            <Text style={styles.deleteModalTitle}>¿Quieres eliminar este usuario?</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteCancelButton}
                onPress={() => setDeleteCandidate(null)}
                disabled={deleteLoading}
              >
                <Text style={styles.deleteCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={handleConfirmDelete}
                disabled={deleteLoading}
              >
                <Text style={styles.deleteConfirmButtonText}>
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!statusCandidate}
        transparent
        animationType="fade"
        onRequestClose={() => !statusLoading && setStatusCandidate(null)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIcon}>
              <MaterialCommunityIcons name="gavel" size={32} color={PURPLE} />
            </View>
            <Text style={styles.deleteModalTitle}>Suspender usuario</Text>

            <View style={styles.suspensionFields}>
              <View>
                <Text style={styles.suspensionLabel}>Cantidad de días</Text>
                <TextInput
                  value={suspensionDays}
                  onChangeText={text => setSuspensionDays(text.replace(/[^0-9]/g, ''))}
                  placeholder="Días"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={styles.suspensionInput}
                />
              </View>
              <View>
                <Text style={styles.suspensionLabel}>Motivo de suspensión</Text>
                <TextInput
                  value={suspensionReason}
                  onChangeText={setSuspensionReason}
                  placeholder="Motivo"
                  placeholderTextColor={colors.placeholder}
                  multiline
                  maxLength={250}
                  scrollEnabled={false}
                  style={[styles.suspensionInput, styles.suspensionTextArea]}
                />
              </View>
            </View>

            {actionError ? <Text style={styles.suspensionErrorText}>{actionError}</Text> : null}

            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteCancelButton}
                onPress={() => {
                  setActionError('');
                  setStatusCandidate(null);
                }}
                disabled={statusLoading}
              >
                <Text style={styles.deleteCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={handleToggleStatus}
                disabled={statusLoading || !suspensionDays.trim() || !suspensionReason.trim()}
              >
                <Text style={styles.deleteConfirmButtonText}>
                  {statusLoading ? 'Guardando...' : 'Suspender'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!reactivateCandidate}
        transparent
        animationType="fade"
        onRequestClose={() => !statusLoading && setReactivateCandidate(null)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteModalIcon}>
              <Ionicons name="play-circle" size={32} color={PURPLE} />
            </View>
            <Text style={styles.deleteModalTitle}>¿Quieres reactivar al usuario?</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteCancelButton}
                onPress={() => setReactivateCandidate(null)}
                disabled={statusLoading}
              >
                <Text style={styles.deleteCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={handleToggleStatus}
                disabled={statusLoading}
              >
                <Text style={styles.deleteConfirmButtonText}>
                  {statusLoading ? 'Guardando...' : 'Reactivar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <UserPreviewModal
        visible={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </View>
  );
}
