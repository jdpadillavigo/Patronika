import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { AdminBottomNavigationItem, UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import { perfilStyles as styles } from '../styles/ProfileStyles';
import ProfileUseCase from '../../domain/usecases/ProfileUseCase';
import SessionUseCase from '../../../auth/login/domain/usecases/SessionUseCase';
import { isSessionExpiredError } from '../../../../core/data/network/HttpClientExt';
import AppTopBar from '../../../../core/presentation/designsystem/components/AppTopBar';
import AdminBottomBar from '../../../../core/presentation/designsystem/components/AdminBottomBar';
import ConfirmationModal from '../../../../core/presentation/designsystem/components/ConfirmationModal';
import ProfileActionButton from '../../../../core/presentation/designsystem/components/ProfileActionButton';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';

export default function PerfilScreen({ navigation, route }) {
  const [usuario, setUsuario] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState('');
  const [modalLogout, setModalLogout] = useState(false);

  const loadProfile = useCallback(() => {
    setLoadingUsuario(true);
    setErrorPerfil('');
    ProfileUseCase.getCurrent()
      .then(user => {
        setUsuario(user);
        setAvatarFailed(false);
      })
      .catch(error => {
        if (!isSessionExpiredError(error)) {
          setErrorPerfil('No se pudo cargar el perfil. Revisa tu conexión e inténtalo nuevamente.');
        }
      })
      .finally(() => {
        setLoadingUsuario(false);
      });
  }, []);

  useFocusEffect(useCallback(() => {
    loadProfile();
  }, [loadProfile]));

  const handleEditProfile = useCallback(() => {
    if (!usuario?.id) return;
    navigation.navigate('EditarUsuarioAdmin', {
      userId: usuario.id,
      editingOwnProfile: true,
    });
  }, [navigation, usuario?.id]);

  const handleConfirmarLogout = async () => {
    setModalLogout(false);
    await SessionUseCase.logout(usuario?.id);
    navigation.replace('Login');
  };

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  const bottomBarIsAdmin = usuario?.isAdmin ?? route?.params?.isAdmin;
  const avatarUri = usuario?.profileImageUrl || usuario?.avatar || null;
  const showProfilePhoto = !!avatarUri && !avatarFailed;

  return (
    <View style={styles.safeArea}>
      <AppTopBar />

      {loadingUsuario && !usuario ? (
        <ScreenState loading text="Cargando perfil..." />
      ) : errorPerfil && !usuario ? (
        <ScreenState
          iconName="cloud-offline-outline"
          text={errorPerfil}
          actionText="Reintentar"
          onAction={loadProfile}
        />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSummary}>
            <View style={styles.avatarFrame}>
              {showProfilePhoto ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatarImage}
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <Ionicons name="person" size={108} color="#000" />
              )}
            </View>

            <Text style={styles.username}>{usuario?.username || 'Usuario'}</Text>
            <Text style={styles.email}>{usuario?.email || 'correo@ejemplo.com'}</Text>
          </View>

          <View style={styles.actions}>
            <ProfileActionButton
              label="Editar perfil"
              iconName="pencil"
              onPress={handleEditProfile}
            />
            <ProfileActionButton
              label="Cerrar sesión"
              iconName="log-out-outline"
              onPress={() => setModalLogout(true)}
            />
          </View>
        </ScrollView>
      )}

      {bottomBarIsAdmin === true ? (
        <AdminBottomBar
          activeItem={AdminBottomNavigationItem.PROFILE}
          onPressUsers={() => navigation.navigate('GestionUsuarios')}
          onPressCommunity={() => navigation.navigate('GestionComunidadAdmin')}
          onPressTutorials={() => navigation.navigate('GestionTutorialesAdmin')}
          onPressProfile={() => undefined}
        />
      ) : bottomBarIsAdmin === false ? (
        <UserBottomBar
          activeItem={UserBottomNavigationItem.PROFILE}
          onPressPatterns={() => navigation.navigate('MisPatrones')}
          onPressCommunity={() => navigation.navigate('Comunidad')}
          onPressTutorials={() => navigation.navigate('Tutoriales')}
          onPressProfile={() => undefined}
          onPressCamera={handleFab}
        />
      ) : null}

      <ConfirmationModal
        visible={modalLogout}
        title="¿Quieres cerrar sesión?"
        iconName="log-out-outline"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onCancel={() => setModalLogout(false)}
        onConfirm={handleConfirmarLogout}
      />
    </View>
  );
}
