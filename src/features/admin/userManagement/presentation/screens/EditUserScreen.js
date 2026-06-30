import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import AnimatedToggle from '../../../../../core/presentation/designsystem/components/AnimatedToggle';
import BackButton from '../../../../../core/presentation/designsystem/components/BackButton';
import FormTextField from '../../../../../core/presentation/designsystem/components/FormTextField';
import { PURPLE } from '../../../../../core/presentation/designsystem/components/CommonStyles';
import { useErrorPopup } from '../../../../../core/presentation/designsystem/components/ErrorPopup';
import VerificationCodeModal from '../../../../../core/presentation/designsystem/components/VerificationCodeModal';
import { gestionUsuariosStyles as styles } from '../styles/UserManagementStyles';
import UserManagementUseCase from '../../domain/usecases/UserManagementUseCase';
import VerificationRepository from '../../../../auth/verification/data/repositories/VerificationRepository';

export default function EditUserScreen({ route, navigation }) {
  const userId = route?.params?.userId;
  const editingOwnProfile = route?.params?.editingOwnProfile === true;
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usernameDraft, setUsernameDraft] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modifyPassword, setModifyPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [emailCodeVisible, setEmailCodeVisible] = useState(false);
  const [emailCodeLoading, setEmailCodeLoading] = useState(false);
  const [emailCodeMessage, setEmailCodeMessage] = useState('Se envió un código de 4 dígitos a tu correo. Ingrésalo para actualizarlo.');
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const { showError, showPopup, errorPopup } = useErrorPopup();

  useEffect(() => {
    Animated.timing(passwordAnim, {
      toValue: modifyPassword ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [modifyPassword, passwordAnim]);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (!userId) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      const result = await UserManagementUseCase.getUserById(userId);
      if (!mounted) return;

      if (!result.success) {
        if (result.sessionExpired) return;
        setError('No se pudo cargar el usuario. Revisa tu conexión e inténtalo nuevamente.');
        setLoading(false);
        return;
      }

      const loadedUser = result.data;
      setUser(loadedUser);
      setUsername(loadedUser?.username || '');
      setEmail(loadedUser?.email || '');
      setUsernameDraft(loadedUser?.username || '');
      setEmailDraft(loadedUser?.email || '');
      setAvatarUri(loadedUser?.profileImageUrl || loadedUser?.avatar || null);
      setAvatarChanged(false);
      setAvatarFailed(false);
      setLoading(false);
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const pickAvatar = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const nextAvatar = result.assets[0].uri;
      setAvatarUri(nextAvatar);
      setAvatarChanged(true);
      setAvatarFailed(false);
      if (editingOwnProfile && user) {
        const imageResult = await UserManagementUseCase.updateProfileImage(user, nextAvatar);
        if (!imageResult.success) {
          if (imageResult.sessionExpired) return;
          showError(imageResult.error || 'No se pudo actualizar la imagen de perfil.');
          return;
        }
        setUser(imageResult.data);
        setAvatarUri(imageResult.data?.profileImageUrl || imageResult.data?.avatar || nextAvatar);
        setAvatarChanged(false);
      }
    }
  }, [editingOwnProfile, showError, user]);

  const handleConfirmUsername = useCallback(async () => {
    if (!user || saving) return;
    setSaving(true);
    const result = await UserManagementUseCase.updateUser({
      ...user,
      username: usernameDraft.trim(),
      email,
    }, null);
    setSaving(false);
    if (!result.success) {
      if (result.sessionExpired) return;
      showError(result.error || 'No se pudo actualizar el nombre de usuario.');
      return;
    }
    setUser(result.data);
    setUsername(result.data?.username || usernameDraft.trim());
    setUsernameDraft(result.data?.username || usernameDraft.trim());
    setEditingUsername(false);
    if (result.message) showPopup(result.message, 'Éxito', { type: 'success' });
  }, [email, saving, showError, showPopup, user, usernameDraft]);

  const requestEmailCode = useCallback(async () => {
    try {
      const result = await VerificationRepository.requestRegisterCode(emailDraft.trim());
      if (!result.success) {
        showError(result.error || 'No se pudo enviar el código de verificación.');
        return false;
      }
      if (typeof result.data === 'string' && result.data.trim()) {
        setEmailCodeMessage(result.data);
      }
      return true;
    } catch (error) {
      showError(error instanceof Error ? error.message : 'No se pudo enviar el código de verificación.');
      return false;
    }
  }, [emailDraft, showError]);

  const handleConfirmEmail = useCallback(async () => {
    if (!user || saving) return;
    setSaving(true);
    const sent = await requestEmailCode();
    setSaving(false);
    if (sent) setEmailCodeVisible(true);
  }, [requestEmailCode, saving, user]);

  const handleSubmitEmailCode = useCallback(async (code) => {
    if (!user || emailCodeLoading) return;
    if (code.length !== 4) {
      showError('Ingresa el código completo.');
      return;
    }

    setEmailCodeLoading(true);
    let verification = null;
    try {
      verification = await VerificationRepository.verifyCode(emailDraft.trim(), code);
    } catch (error) {
      setEmailCodeLoading(false);
      showError(error instanceof Error ? error.message : 'No se pudo verificar el código.');
      return;
    }
    if (!verification.success) {
      setEmailCodeLoading(false);
      showError(verification.error || 'No se pudo verificar el código.');
      return;
    }

    const result = await UserManagementUseCase.updateUser({
      ...user,
      username,
      email: emailDraft.trim(),
    }, null);
    setEmailCodeLoading(false);
    if (!result.success) {
      if (result.sessionExpired) return;
      showError(result.error || 'No se pudo actualizar el correo electrónico.');
      return;
    }

    setUser(result.data);
    setEmail(result.data?.email || emailDraft.trim());
    setEmailDraft(result.data?.email || emailDraft.trim());
    showPopup(result.message || verification.data, 'Éxito', {
      type: 'success',
      onAccept: () => {
        setEmailCodeVisible(false);
        setEditingEmail(false);
      },
    });
  }, [emailCodeLoading, emailDraft, showError, showPopup, user, username]);

  const handleSave = useCallback(async () => {
    if (!user || saving) return;

    if (editingOwnProfile && modifyPassword) {
      setSaving(true);
      const passwordResult = await UserManagementUseCase.changeOwnPassword(
        currentPassword,
        newPassword,
        confirmNewPassword,
      );
      if (!passwordResult.success) {
        setSaving(false);
        if (passwordResult.sessionExpired) return;
        showError(passwordResult.error || 'No se pudo cambiar la contraseña.');
        return;
      }
      setSaving(false);
      showPopup(passwordResult.message, 'Éxito', {
        type: 'success',
        onAccept: () => {
          setModifyPassword(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        },
      });
      return;
    }

    setSaving(true);
    setError('');
    const result = await UserManagementUseCase.updateUser({
      ...user,
      username: username.trim(),
      email: email.trim(),
    }, avatarChanged ? avatarUri : null);

    if (!result.success) {
      setSaving(false);
      if (result.sessionExpired) return;
      showError(result.error || 'No se pudo guardar el usuario. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }

    setSaving(false);
    navigation.goBack();
  }, [
    avatarChanged,
    avatarUri,
    confirmNewPassword,
    currentPassword,
    editingOwnProfile,
    modifyPassword,
    navigation,
    newPassword,
    saving,
    showError,
    showPopup,
    user,
    username,
    email,
  ]);

  const showAvatar = !!avatarUri && !avatarFailed;

  const renderOwnFieldActions = (field) => {
    const isUsernameField = field === 'username';
    const isEditing = isUsernameField ? editingUsername : editingEmail;
    const start = () => {
      if (isUsernameField) {
        setUsernameDraft(username);
        setEditingUsername(true);
      } else {
        setEmailDraft(email);
        setEditingEmail(true);
      }
    };
    const cancel = () => {
      if (isUsernameField) {
        setUsernameDraft(username);
        setEditingUsername(false);
      } else {
        setEmailDraft(email);
        setEditingEmail(false);
      }
    };
    const confirm = isUsernameField ? handleConfirmUsername : handleConfirmEmail;

    if (!isEditing) {
      return (
        <TouchableOpacity onPress={start} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="pencil" size={22} color={PURPLE} />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.fieldActionIcons}>
        <TouchableOpacity onPress={confirm} disabled={saving} hitSlop={{ top: 10, bottom: 10, left: 10, right: 8 }}>
          <Ionicons name="checkmark" size={24} color={PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={cancel} disabled={saving} hitSlop={{ top: 10, bottom: 10, left: 8, right: 10 }}>
          <Ionicons name="close" size={24} color={PURPLE} />
        </TouchableOpacity>
      </View>
    );
  };

  const passwordHeight = passwordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 430],
  });
  const passwordOpacity = passwordAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const canUpdatePassword = currentPassword.trim() && newPassword.trim() && confirmNewPassword.trim() && !saving;

  return (
    <View style={styles.editSafeArea}>
      <ScrollView
        style={styles.editSafeArea}
        contentContainerStyle={styles.editContent}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => navigation.goBack()} style={styles.editBackButton} />

        {loading ? (
          <View style={styles.editLoadingContainer}>
            <ActivityIndicator size="large" color={PURPLE} />
            <Text style={styles.centerStateText}>Cargando usuario...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.editTitle}>{editingOwnProfile ? 'Editar perfil' : 'Editar usuario'}</Text>

            <TouchableOpacity style={styles.editAvatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
              {showAvatar ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.editAvatarImage}
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <View style={styles.editAvatarPlaceholder}>
                  <Ionicons name="person" size={96} color="#888" />
                </View>
              )}
              <View style={styles.editAvatarBadge}>
                <Ionicons name={showAvatar ? 'pencil' : 'add'} size={22} color="white" />
              </View>
            </TouchableOpacity>

            <FormTextField
              label="Nombre de usuario"
              value={editingOwnProfile ? usernameDraft : username}
              onChangeText={editingOwnProfile ? setUsernameDraft : setUsername}
              placeholder="Nombre de usuario"
              editable={!editingOwnProfile || editingUsername}
              labelRightAction={editingOwnProfile ? renderOwnFieldActions('username') : null}
              inputContainerStyle={editingOwnProfile && !editingUsername ? styles.lockedInputContainer : null}
              inputProps={{ maxLength: 40 }}
            />

            <FormTextField
              label="Correo electrónico"
              value={editingOwnProfile ? emailDraft : email}
              onChangeText={editingOwnProfile ? setEmailDraft : setEmail}
              placeholder="Correo electrónico"
              editable={!editingOwnProfile || editingEmail}
              labelRightAction={editingOwnProfile ? renderOwnFieldActions('email') : null}
              inputContainerStyle={editingOwnProfile && !editingEmail ? styles.lockedInputContainer : null}
              inputProps={{ keyboardType: 'email-address', maxLength: 80 }}
            />

            {editingOwnProfile ? (
              <>
                <View style={styles.passwordToggleRow}>
                  <Text style={styles.passwordToggleText}>Modificar contraseña</Text>
                  <AnimatedToggle value={modifyPassword} onValueChange={setModifyPassword} disabled={saving} />
                </View>

                <Animated.View
                  style={[
                    styles.animatedPasswordFields,
                    { maxHeight: passwordHeight, opacity: passwordOpacity },
                  ]}
                  pointerEvents={modifyPassword ? 'auto' : 'none'}
                >
                  <FormTextField
                    label="Contraseña actual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Contraseña actual"
                    secureTextEntry
                    inputProps={{ maxLength: 80 }}
                  />
                  <FormTextField
                    label="Nueva contraseña"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                    inputProps={{ maxLength: 80 }}
                  />
                  <FormTextField
                    label="Confirmar nueva contraseña"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholder="Confirmar nueva contraseña"
                    secureTextEntry
                    inputProps={{ maxLength: 80 }}
                  />
                  <TouchableOpacity
                    style={[styles.editSaveButton, styles.passwordUpdateButton, !canUpdatePassword && styles.editSaveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!canUpdatePassword}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.editSaveButtonText}>
                      {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : null}

            {error ? <Text style={styles.editErrorText}>{error}</Text> : null}

            {!editingOwnProfile ? (
              <TouchableOpacity
                style={[styles.editSaveButton, saving && styles.editSaveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.85}
              >
                <Text style={styles.editSaveButtonText}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </ScrollView>
      <VerificationCodeModal
        visible={emailCodeVisible}
        title="Verifica tu correo"
        message={emailCodeMessage}
        loading={emailCodeLoading}
        onCancel={() => {
          if (!emailCodeLoading) setEmailCodeVisible(false);
        }}
        onResend={requestEmailCode}
        onSubmit={handleSubmitEmailCode}
      />
      {errorPopup}
    </View>
  );
}
