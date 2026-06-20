import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from '../styles/CommonStyles';
import { gestionUsuariosStyles as styles } from '../styles/GestionUsuariosStyles';
import UserUseCase from '../../domain/usecases/UserUseCase';
import ProfileUseCase from '../../domain/usecases/ProfileUseCase';
import AdminBottomNavbar from '../components/AdminBottomNavBar';
 
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
function UserCard({ user }) {
  const isActive = user.status === 0; // status 0 = activo, otro valor = suspendido (igual que en PerfilScreen/User.ts)
  const inicial = user.username?.charAt(0)?.toUpperCase() || '?';
 
  if(isMenuOpen) {
    return (
    <View style={styles.actionsOverlay}>
        <TouchableOpacity style={styles.closeOverlayButton} onPress={onCloseMenu}>
          <Ionicons name="close" size={14} color="white" />
        </TouchableOpacity>
 
        {/* Los 3 botones no ejecutan ninguna acción todavía (a propósito) */}
        <View style={styles.overlayAction}>
          <View style={styles.overlayIconCircle}>
            <Ionicons name="pencil-outline" size={20} color="white" />
          </View>
          <Text style={styles.overlayActionLabel}>Editar</Text>
        </View>
 
        <View style={styles.overlayAction}>
          <View style={styles.overlayIconCircle}>
            <Ionicons name="happy-outline" size={20} color="white" />
          </View>
          <Text style={styles.overlayActionLabel}>Estado: {isActive ? 'Activo' : 'Suspendido'}</Text>
        </View>
 
        <View style={styles.overlayAction}>
          <View style={styles.overlayIconCircle}>
            <Ionicons name="trash-outline" size={20} color="white" />
          </View>
          <Text style={styles.overlayActionLabel}>Eliminar</Text>
        </View>
      </View>
  );
}
return (
    <View style={styles.userCard}>
      {user.profileImageUrl ? (
        <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={26} color="#999" />
        </View>
      )}
 
      <View style={styles.userInfo}>
        <View style={styles.userTopRow}>
          <Text style={styles.userName} numberOfLines={1}>{user.username}</Text>
          <TouchableOpacity style={styles.moreButton} onPress={onToggleMenu}>
            <Ionicons name="ellipsis-vertical" size={18} color={PURPLE} />
          </TouchableOpacity>
        </View>
 
        <View style={styles.userEmailRow}>
          <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
          <Text style={styles.userId}>ID: {user.id ?? '-'}</Text>
        </View>
 
        <View style={styles.userMetaRow}>
          <Text style={[styles.userMetaText, user.isAdmin && styles.rolAdminText]}>
            Rol: {user.isAdmin ? 'Admin' : 'Usuario'}
          </Text>
          <Text style={styles.userMetaSeparator}>|</Text>
          <Text style={[styles.userMetaText, isActive ? styles.estadoActivoText : styles.estadoSuspendidoText]}>
            Estado: {isActive ? 'Activo' : 'Suspendido'}
          </Text>
        </View>
 
        <Text style={styles.userDateText}>Fecha de registro: {formatFecha(user.registeredDate)}</Text>
      </View>
    </View>
  );
}
 
export default function GestionUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [esAdmin, setEsAdmin] = useState(null); // null = aún verificando, true/false = resultado
  const [busqueda, setBusqueda] = useState('');
  const [menuAbiertoId, setMenuAbiertoId] = useState(null); // id del usuario cuyo menú overlay está abierto
 
  // Verifica el rol del usuario actual antes de mostrar el listado (criterio de aceptación #3)
  const verificarAccesoYCargar = useCallback(async () => {
    setLoading(true);
    setError('');
 
    const currentUser = await ProfileUseCase.getCurrent().catch(() => null);
    if (!currentUser?.isAdmin) {
      setEsAdmin(false);
      setLoading(false);
      return;
    }
    setEsAdmin(true);
    

    const result = await UserUseCase.getAllUsers();
    if (!result.success) {
      setError(result.error || 'No se pudo cargar el listado de usuarios');
      setUsuarios([]);
    } else {
      setUsuarios(result.data || []);
    }
    setLoading(false);
  }, []);
 
  useEffect(() => {
    verificarAccesoYCargar();
  }, [verificarAccesoYCargar]);

  const usuarioFilrados = useMemo (() => {
    const query = busqueda.trim().toLowerCase();
    if(!query) return usuarios;
    return usuarios.filter( u =>
      u.username?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
    );
  }, [usuarios,busqueda] );
 
  // ── Acceso denegado (criterio de aceptación #3) ──────────────────────────
  if (esAdmin === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
        <View style={styles.header}>
           <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Patrónika</Text>
          </View>
        </View>
        <View style={styles.centerState}>
          <Ionicons name="lock-closed-outline" size={48} color="#CCC" />
          <Text style={styles.deniedTitle}>Acceso restringido</Text>
          <Text style={styles.deniedText}>Esta sección solo está disponible para administradores.</Text>
        </View>
      </SafeAreaView>
    );
  }
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
 
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Patrónika</Text>
          <TouchableOpacity>
            <Text style={styles.filtrarText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
 
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar.."
            placeholderTextColor="#999"
            value={busqueda}
            onChangeText={setBusqueda}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Estado: cargando */}
      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={PURPLE} />
          <Text style={styles.centerStateText}>Cargando usuarios...</Text>
        </View>
      )}
 
      {/* Estado: error (criterio de aceptación #4) */}
      {!loading && error ? (
        <View style={styles.centerState}>
          <Ionicons name="cloud-offline-outline" size={48} color="#CCC" />
          <Text style={styles.centerStateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={verificarAccesoYCargar}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
 
      {/* Estado: listado vacío (criterio de aceptación #4) */}
      {!loading && !error && (
        <>
          <Text style={styles.resultsCount}>
            Mostrando {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? 'resultado' : 'resultados'}
          </Text>
 
          {usuariosFiltrados.length === 0 ? (
            <View style={styles.centerState}>
              <Ionicons name="people-outline" size={48} color="#CCC" />
              <Text style={styles.centerStateText}>No se encontraron usuarios.</Text>
            </View>
          ) : (
            <FlatList
              data={usuariosFiltrados}
              keyExtractor={item => item.id || item.email}
              renderItem={({ item }) => (
                <UserCard
                  user={item}
                  isMenuOpen={menuAbiertoId === (item.id || item.email)}
                  onToggleMenu={() => setMenuAbiertoId(item.id || item.email)}
                  onCloseMenu={() => setMenuAbiertoId(null)}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      )}
 
      {/* Barra inferior tipo admin — sin botón de cámara */}
      <AdminBottomNavbar
        activeItem="users"
        onPressUsers={() => {}}
        onPressCommunity={() => navigation.navigate('Comunidad')}
        onPressProfile={() => navigation.navigate('Perfil')}
      />
    </SafeAreaView>
  );
}