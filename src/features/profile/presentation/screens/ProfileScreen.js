import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AdminBottomNavigationItem, UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import { PURPLE } from '../../../../core/presentation/designsystem/components/CommonStyles';
import { perfilStyles as styles } from '../styles/ProfileStyles';
import ProfileUseCase from '../../domain/usecases/ProfileUseCase';
import SessionUseCase from '../../../auth/login/domain/usecases/SessionUseCase';
import { isSessionExpiredError } from '../../../../core/data/network/HttpClientExt';
import AdminBottomBar from '../../../../core/presentation/designsystem/components/AdminBottomBar';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import UserPreviewModal from '../../../../core/presentation/designsystem/components/UserPreviewModal';

export default function PerfilScreen({ navigation, route }) {
  const [usuario, setUsuario] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Edición de datos
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [confirmPass, setConfirmPass] = useState('');
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState('');
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  // Cambio de contraseña
  const [expandirPass, setExpandirPass] = useState(false);
  const [passActual, setPassActual] = useState('');
  const [passNueva, setPassNueva] = useState('');
  const [passConfirmar, setPassConfirmar] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [exitoPass, setExitoPass] = useState('');

  useEffect(() => {
    ProfileUseCase.getCurrent()
      .then(u => {
        setUsuario(u);
        setNuevoNombre(u?.username ?? '');
        setNuevaFoto(u?.avatar ?? null);
        setAvatarFailed(false);
      })
      .catch(error => {
        if (!isSessionExpiredError(error)) {
          setErrorPerfil(error.message);
        }
      })
      .finally(() => {
        setLoadingUsuario(false);
      });
  }, []);

  const handlePickFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setNuevaFoto(result.assets[0].uri);
    setAvatarFailed(false);
  };

  const handleGuardarPerfil = async () => {
    setErrorPerfil('');
    if (!nuevoNombre.trim()) {
      setErrorPerfil('El nombre de usuario no puede estar vacío');
      return;
    }
    setLoadingPerfil(true);
    try {
      const result = await ProfileUseCase.updateProfile(nuevoNombre.trim(), confirmPass, nuevaFoto);
      if (!result.success) {
        if (result.sessionExpired) return;
        setErrorPerfil(result.error || 'No se pudo actualizar el perfil');
        return;
      }
      setUsuario(result.data);
      setAvatarFailed(false);
      setEditando(false);
    } catch (e) {
      setErrorPerfil(e.message);
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleCancelarEdicion = () => {
    setNuevoNombre(usuario?.username ?? '');
    setNuevaFoto(usuario?.avatar ?? null);
    setConfirmPass('');
    setMostrarConfirmPass(false);
    setErrorPerfil('');
    setEditando(false);
  };

  const handleCambiarPassword = async () => {
    setErrorPass('');
    setExitoPass('');
    if (!passActual || !passNueva || !passConfirmar) {
      setErrorPass('Completa todos los campos');
      return;
    }
    if (passNueva !== passConfirmar) {
      setErrorPass('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passNueva.length < 4) {
      setErrorPass('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }
    setLoadingPass(true);
    try {
      const result = await ProfileUseCase.changePassword(passActual, passNueva, passConfirmar);
      if (!result.success) {
        if (result.sessionExpired) return;
        setErrorPass(result.error || 'No se pudo cambiar la contraseña');
        return;
      }
      setExitoPass('Contraseña actualizada correctamente');
      setPassActual('');
      setPassNueva('');
      setPassConfirmar('');
      setExpandirPass(false);
    } catch (e) {
      setErrorPass(e.message);
    } finally {
      setLoadingPass(false);
    }
  };

  const [modalLogout, setModalLogout] = useState(false);

  const handleLogout = () => {
    setModalLogout(true);
  };

  const handleConfirmarLogout = async () => {
    setModalLogout(false);
    await SessionUseCase.logout(usuario?.id);
    navigation.replace('Login');
  };

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  const fotoActual = editando ? nuevaFoto : usuario?.avatar;
  const bottomBarIsAdmin = usuario?.isAdmin ?? route?.params?.isAdmin;
  const showProfilePhoto = !!fotoActual && !avatarFailed;

  return (
    <View style={styles.safeArea}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patrónika</Text>
      </View>

      {loadingUsuario && !usuario ? (
        <View style={styles.profileLoadingContainer}>
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >

        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={editando ? handlePickFoto : () => usuario && setPreviewVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarFrame}>
              {showProfilePhoto
                ? <Image source={{ uri: fotoActual }} style={styles.avatarImage} onError={() => setAvatarFailed(true)} />
                : <Ionicons name="person" size={56} color={PURPLE} />
              }
            </View>
            {editando && (
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={14} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {!editando && (
            <Text style={styles.username}>
              {usuario?.username ?? 'Usuario'}
            </Text>
          )}
        </View>

        {/* DATOS DEL PERFIL */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Datos del perfil</Text>
            {!editando && (
              <TouchableOpacity onPress={() => setEditando(true)} style={styles.editButton}>
                <Ionicons name="pencil-outline" size={16} color={PURPLE} />
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nombre de usuario */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldHeader}>
              <Ionicons name="person-outline" size={16} color={PURPLE} />
              <Text style={styles.fieldLabel}>NOMBRE DE USUARIO</Text>
            </View>
            {editando ? (
              <TextInput
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.editableInput}
              />
            ) : (
              <Text style={styles.readonlyValue}>
                {usuario?.username ?? 'Usuario'}
              </Text>
            )}
          </View>

          {/* Correo (solo lectura) */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldHeader}>
              <Ionicons name="mail-outline" size={16} color={PURPLE} />
              <Text style={styles.fieldLabel}>CORREO ELECTRÓNICO</Text>
            </View>
            <Text style={[styles.readonlyValue, styles.readonlyEmail]}>
              {usuario?.email ?? 'Email'}
            </Text>
          </View>

          {/* Contraseña actual (requerida para guardar) */}
          {editando && (
            <View style={styles.fieldGroup}>
              <View style={styles.fieldHeader}>
                <Ionicons name="lock-closed-outline" size={16} color={PURPLE} />
                <Text style={styles.fieldLabel}>CONTRASEÑA ACTUAL</Text>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  secureTextEntry={!mostrarConfirmPass}
                  autoCapitalize="none"
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña para confirmar"
                  placeholderTextColor="#BBB"
                />
                <TouchableOpacity onPress={() => setMostrarConfirmPass(v => !v)}>
                  <Ionicons name={mostrarConfirmPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {errorPerfil ? (
            <Text style={styles.errorText}>{errorPerfil}</Text>
          ) : null}

          {/* Botones edición */}
          {editando && (
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={handleCancelarEdicion}
                style={styles.outlineButton}
              >
                <Text style={styles.outlineButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGuardarPerfil}
                disabled={loadingPerfil}
                style={styles.solidButton}
              >
                <Text style={styles.solidButtonText}>
                  {loadingPerfil ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CAMBIAR CONTRASEÑA */}
        <View style={styles.passwordSection}>
          <TouchableOpacity
            onPress={() => { setExpandirPass(v => !v); setErrorPass(''); setExitoPass(''); }}
            style={styles.passwordHeader}
          >
            <View style={styles.passwordTitleGroup}>
              <Ionicons name="lock-closed-outline" size={18} color={PURPLE} />
              <Text style={styles.sectionTitle}>Cambiar contraseña</Text>
            </View>
            <Ionicons name={expandirPass ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
          </TouchableOpacity>

          {expandirPass && (
            <View style={styles.passwordFields}>
              {/* Contraseña actual */}
              <View style={styles.passwordField}>
                <Text style={styles.fieldLabel}>CONTRASEÑA ACTUAL</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    value={passActual}
                    onChangeText={setPassActual}
                    secureTextEntry={!mostrarActual}
                    autoCapitalize="none"
                    style={styles.passwordInput}
                    placeholder="Contraseña actual"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarActual(v => !v)}>
                    <Ionicons name={mostrarActual ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Nueva contraseña */}
              <View style={styles.passwordField}>
                <Text style={styles.fieldLabel}>NUEVA CONTRASEÑA</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    value={passNueva}
                    onChangeText={setPassNueva}
                    secureTextEntry={!mostrarNueva}
                    autoCapitalize="none"
                    style={styles.passwordInput}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarNueva(v => !v)}>
                    <Ionicons name={mostrarNueva ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar nueva */}
              <View style={styles.passwordField}>
                <Text style={styles.fieldLabel}>CONFIRMAR NUEVA CONTRASEÑA</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    value={passConfirmar}
                    onChangeText={setPassConfirmar}
                    secureTextEntry={!mostrarConfirmar}
                    autoCapitalize="none"
                    style={styles.passwordInput}
                    placeholder="Repite la nueva contraseña"
                    placeholderTextColor="#BBB"
                  />
                  <TouchableOpacity onPress={() => setMostrarConfirmar(v => !v)}>
                    <Ionicons name={mostrarConfirmar ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              {errorPass ? (
                <Text style={styles.errorText}>{errorPass}</Text>
              ) : null}
              {exitoPass ? (
                <Text style={styles.successText}>{exitoPass}</Text>
              ) : null}

              <TouchableOpacity
                onPress={handleCambiarPassword}
                disabled={loadingPass}
                style={styles.updatePasswordButton}
              >
                <Text style={styles.updatePasswordText}>
                  {loadingPass ? 'Actualizando...' : 'Actualizar contraseña'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Ionicons name="log-out-outline" size={20} color={PURPLE} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        </ScrollView>
      )}

      {bottomBarIsAdmin === true ? (
        <AdminBottomBar
          activeItem={AdminBottomNavigationItem.PROFILE}
          onPressUsers={() => navigation.navigate('GestionUsuarios')}
          onPressCommunity={() => navigation.navigate('GestionComunidadAdmin')}
          onPressProfile={() => undefined}
        />
      ) : bottomBarIsAdmin === false ? (
        <UserBottomBar
          activeItem={UserBottomNavigationItem.PROFILE}
          onPressPatterns={() => navigation.navigate('MisPatrones')}
          onPressCommunity={() => navigation.navigate('Comunidad')}
          onPressProfile={() => undefined}
          onPressCamera={handleFab}
        />
      ) : null}

      {/* Modal de confirmación de cierre de sesión */}
      <Modal
        visible={modalLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setModalLogout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={30} color={PURPLE} />
            </View>

            <Text style={styles.modalTitle}>
              ¿Cerrar sesión?
            </Text>

            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas cerrar sesión?
            </Text>

            <TouchableOpacity
              onPress={handleConfirmarLogout}
              style={styles.modalPrimaryButton}
            >
              <Text style={styles.modalPrimaryText}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalLogout(false)}
              style={styles.modalSecondaryButton}
            >
              <Text style={styles.modalSecondaryText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <UserPreviewModal
        visible={previewVisible}
        user={usuario}
        onClose={() => setPreviewVisible(false)}
      />

    </View>
  );
}

