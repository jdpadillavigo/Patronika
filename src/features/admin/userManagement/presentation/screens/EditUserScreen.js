import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { PURPLE } from '../../../../../core/presentation/designsystem/components/CommonStyles';
import BackButton from '../../../../../core/presentation/designsystem/components/BackButton';
import { gestionUsuariosStyles as styles } from '../styles/UserManagementStyles';
import UserManagementUseCase from '../../domain/usecases/UserManagementUseCase';

export default function EditUserScreen({ route, navigation }) {
  const userId = route?.params?.userId;
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      setAvatarUri(loadedUser?.profileImageUrl || loadedUser?.avatar || null);
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
      setAvatarUri(result.assets[0].uri);
      setAvatarFailed(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!user || saving) return;

    setSaving(true);
    setError('');
    const result = await UserManagementUseCase.updateUser({
      ...user,
      username: username.trim(),
      email: email.trim(),
    }, avatarUri);
    setSaving(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      setError('No se pudo guardar el usuario. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }

    navigation.goBack();
  }, [avatarUri, email, navigation, saving, user, username]);

  const showAvatar = !!avatarUri && !avatarFailed;

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
            <Text style={styles.editTitle}>Editar usuario</Text>

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
                <Ionicons name="add" size={32} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Nombre de usuario</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                placeholderTextColor="#555"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={40}
                style={styles.editInput}
              />
            </View>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Correo electrónico</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Correo electrónico"
                placeholderTextColor="#555"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                maxLength={80}
                style={styles.editInput}
              />
            </View>

            {error ? <Text style={styles.editErrorText}>{error}</Text> : null}

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
          </>
        )}
      </ScrollView>

    </View>
  );
}
