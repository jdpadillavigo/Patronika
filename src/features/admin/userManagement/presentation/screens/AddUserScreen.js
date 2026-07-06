import React, { useCallback, useState, useMemo } from 'react';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../../core/presentation/designsystem/Theme';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
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
import { PURPLE } from '../../../../../core/presentation/designsystem/components/CommonStyles';
import { createGestionUsuariosStyles, gestionUsuariosStyles as styles } from '../styles/UserManagementStyles';
import UserManagementUseCase from '../../domain/usecases/UserManagementUseCase';
import { useErrorPopup } from '../../../../../core/presentation/designsystem/components/ErrorPopup';

export default function AddUserScreen({navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createGestionUsuariosStyles(colors), [colors]);
  const [avatarUri, setAvatarUri] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
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
      isAdmin,
    );
    setSaving(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      showError(result.error || 'No se pudo registrar el usuario. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }

    navigation.goBack();
  }, [avatarUri, canSubmit, confirmPassword, email, isAdmin, navigation, password, showError, username]);

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
              <Ionicons name="person" size={96} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.addAvatarBadge}>
            <Ionicons name={avatarUri ? 'pencil' : 'add'} size={22} color={Colors.fixedWhite} />
          </View>
        </TouchableOpacity>

        <View style={styles.editFieldGroup}>
          <Text style={styles.editLabel}>Nombre de usuario</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nombre de usuario"
            placeholderTextColor={colors.textSecondary}
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
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            maxLength={80}
            style={styles.editInput}
          />
        </View>

        <View style={styles.editFieldGroup}>
          <Text style={styles.editLabel}>Tipo</Text>
          <TouchableOpacity
            style={styles.editSelectButton}
            onPress={() => setTypeModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.editSelectText}>{isAdmin ? 'Admin' : 'Usuario'}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.placeholder} />
          </TouchableOpacity>
        </View>

        <View style={styles.editFieldGroup}>
          <Text style={styles.editLabel}>Contraseña</Text>
          <View style={styles.addPasswordInputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              maxLength={80}
              style={styles.addPasswordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(value => !value)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.placeholder} />
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
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              maxLength={80}
              style={styles.addPasswordInput}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(value => !value)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.placeholder} />
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
            {saving ? 'Agregando...' : 'Agregar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={typeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.statusModalOverlay}
          activeOpacity={1}
          onPress={() => setTypeModalVisible(false)}
        >
          <View style={styles.statusModalCard}>
            {[
              { label: 'Usuario', value: false },
              { label: 'Admin', value: true },
            ].map(option => (
              <TouchableOpacity
                key={option.label}
                style={styles.statusOption}
                onPress={() => {
                  setIsAdmin(option.value);
                  setTypeModalVisible(false);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.statusOptionText}>{option.label}</Text>
                {isAdmin === option.value ? (
                  <Ionicons name="checkmark" size={20} color={PURPLE} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      {errorPopup}
    </KeyboardAvoidingView>
  );
}
