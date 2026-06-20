import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from '../styles/CommonStyles';
import { gestionUsuariosStyles as styles } from '../styles/GestionUsuariosStyles';
import UserUseCase from '../../domain/usecases/UserUseCase';
import ProfileUseCase from '../../domain/usecases/ProfileUseCase';
 
// Formatea la fecha de registro a un formato legible (DD/MM/AAAA)
function formatFecha(fechaIso) {
  if (!fechaIso) return 'Sin fecha';
  try {
    const date = new Date(fechaIso);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return 'Sin fecha';
  }
}
 
// Card individual de cada usuario en el listado
function UserCard({ user }) {
  const isActive = user.status === 0; // status 0 = activo, otro valor = suspendido (igual que en PerfilScreen/User.ts)
  const inicial = user.username?.charAt(0)?.toUpperCase() || '?';
 
  return (
    <View style={styles.userCard}>
      <View style={styles.userCardTop}>
        {/* Avatar — imagen si existe, si no un círculo con la inicial */}
        {user.profileImageUrl ? (
          <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{inicial}</Text>
          </View>
        )}
 
        <View style={styles.userNameBlock}>
          <Text style={styles.userName} numberOfLines={1}>{user.username}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
        </View>
      </View>
 
      {/* Badges de rol y estado */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, user.isAdmin ? styles.badgeAdmin : styles.badgeUser]}>
          <Text style={[styles.badgeText, user.isAdmin ? styles.badgeAdminText : styles.badgeUserText]}>
            {user.isAdmin ? 'Administrador' : 'Usuario'}
          </Text>
        </View>
        <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeSuspended]}>
          <Text style={[styles.badgeText, isActive ? styles.badgeActiveText : styles.badgeSuspendedText]}>
            {isActive ? 'Activo' : 'Suspendido'}
          </Text>
        </View>
      </View>
 
      {/* Pie: fecha de registro + estadísticas de actividad */}
      <View style={styles.userCardFooter}>
        <View style={styles.footerStat}>
          <Text style={styles.footerStatValue}>{formatFecha(user.registeredDate)}</Text>
          <Text style={styles.footerStatLabel}>Registrado</Text>
        </View>
        <View style={styles.footerStat}>
          {/* patternsCount puede no venir del backend todavía — se muestra 0 por defecto */}
          <Text style={styles.footerStatValue}>{user.patternsCount ?? 0}</Text>
          <Text style={styles.footerStatLabel}>Patrones</Text>
        </View>
        <View style={styles.footerStat}>
          <Text style={styles.footerStatValue}>{user.loggedIn ? 'Sí' : 'No'}</Text>
          <Text style={styles.footerStatLabel}>Conectado</Text>
        </View>
      </View>
    </View>
  );
}
 
export default function GestionUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [esAdmin, setEsAdmin] = useState(null); // null = aún verificando, true/false = resultado
 
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
 
  // ── Acceso denegado (criterio de aceptación #3) ──────────────────────────
  if (esAdmin === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Usuarios</Text>
        </View>
        <View style={styles.centerState}>
          <Ionicons name="lock-closed-outline" size={48} color="#CCC" style={styles.deniedIcon} />
          <Text style={styles.deniedTitle}>Acceso restringido</Text>
          <Text style={styles.deniedText}>
            Esta sección solo está disponible para administradores.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />
 
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Usuarios</Text>
          <Text style={styles.headerSubtitle}>
            {usuarios.length} {usuarios.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
          </Text>
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
      {!loading && !error && usuarios.length === 0 && (
        <View style={styles.centerState}>
          <Ionicons name="people-outline" size={48} color="#CCC" />
          <Text style={styles.centerStateText}>No hay usuarios registrados aún.</Text>
        </View>
      )}
 
      {/* Estado: listado con datos (criterios de aceptación #1 y #2) */}
      {!loading && !error && usuarios.length > 0 && (
        <FlatList
          data={usuarios}
          keyExtractor={item => item.id || item.email}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}