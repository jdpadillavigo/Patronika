import React, { useCallback, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import BackButton from '../../../../../core/presentation/designsystem/components/BackButton';
import { gestionUsuariosStyles as styles } from '../styles/UserManagementStyles';
import UserManagementUseCase from '../../domain/usecases/UserManagementUseCase';
import { useErrorPopup } from '../../../../../core/presentation/designsystem/components/ErrorPopup';

export default function AddUserScreen({ navigation }) {
  const [avatarUri, setAvatarUri] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showError, errorPopup } = useErrorPopup();

  const canSubmit =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !saving;

  const pickAvatar = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  }, []);

  const handleRegister = useCallback(async () => {
    if (!canSubmit) return;

    setSaving(true);
    const result = await UserManagementUseCase.createUser(
      username.trim(),
      email.trim(),
      password,
      confirmPassword,
      avatarUri,
    );
    setSaving(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      showError(result.error || 'No se pudo registrar el usuario. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }

    navigation.goBack();
  }, [avatarUri, canSubmit, confirmPassword, email, navigation, password, showError, username]);

  return (
    <KeyboardAvoidingView
      style={styles.editSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.editSafeArea}
        contentContainerStyle={styles.addUserContent}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => navigation.goBack()} style={styles.editBackButton} />

        <Text style={styles.editTitle}>Agregar nuevo usuario</Text>

        <TouchableOpacity style={styles.addAvatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.addAvatarImage} />
          ) : (
            <View style={styles.addAvatarPlaceholder}>
              <Ionicons name="person" size={48} color="#888" />
            </View>
          )}
          <View style={styles.addAvatarBadge}>
            <Ionicons name="add" size={16} color="white" />
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

        <View style={styles.editFieldGroup}>
          <Text style={styles.editLabel}>Contraseña</Text>
          <View style={styles.addPasswordInputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor="#555"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              maxLength={80}
              style={styles.addPasswordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(value => !value)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.editFieldGroup}>
          <Text style={styles.editLabel}>Confirmar contraseña</Text>
          <View style={styles.addPasswordInputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#555"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              maxLength={80}
              style={styles.addPasswordInput}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(value => !value)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editSaveButton, !canSubmit && styles.editSaveButtonDisabled]}
          onPress={handleRegister}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.editSaveButtonText}>
            {saving ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {errorPopup}
    </KeyboardAvoidingView>
  );
}
