import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PURPLE } from '../../../../../core/presentation/designsystem/components/CommonStyles';
import { gestionUsuariosStyles as styles } from '../styles/UserManagementStyles';
import UserManagementUseCase from '../../domain/usecases/UserManagementUseCase';

const STATUS_ACTIVE = 0;
const STATUS_SUSPENDED = 1;

function statusLabel(status) {
  return status === STATUS_ACTIVE ? 'Activo' : 'Suspendido';
}

export default function EditUserScreen({ route, navigation }) {
  const userId = route?.params?.userId;
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(STATUS_ACTIVE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusVisible, setStatusVisible] = useState(false);

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
        setError(result.error || 'No se pudo cargar el usuario');
        setLoading(false);
        return;
      }

      const loadedUser = result.data;
      setUser(loadedUser);
      setUsername(loadedUser?.username || '');
      setEmail(loadedUser?.email || '');
      setStatus(loadedUser?.status === STATUS_ACTIVE ? STATUS_ACTIVE : STATUS_SUSPENDED);
      setLoading(false);
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleSave = useCallback(async () => {
    if (!user || saving) return;

    setSaving(true);
    setError('');
    const result = await UserManagementUseCase.updateUser({
      ...user,
      username,
      email,
      status,
    });
    setSaving(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      setError(result.error || 'No se pudo guardar el usuario');
      return;
    }

    navigation.goBack();
  }, [email, navigation, saving, status, user, username]);

  return (
    <View style={styles.editSafeArea}>
      <View style={styles.editContent}>
        <TouchableOpacity style={styles.editBackButton} onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={28} color={PURPLE} />
          <Text style={styles.editBackText}>Volver</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.editLoadingContainer}>
            <ActivityIndicator size="large" color={PURPLE} />
          </View>
        ) : (
          <>
            <Text style={styles.editTitle}>Editar Usuario</Text>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Nombre de usuario</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                placeholderTextColor="#555"
                autoCapitalize="none"
                autoCorrect={false}
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
                style={styles.editInput}
              />
            </View>

            <View style={styles.editFieldGroup}>
              <Text style={styles.editLabel}>Estado</Text>
              <TouchableOpacity
                style={styles.editSelectButton}
                onPress={() => setStatusVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.editSelectText}>{statusLabel(status)}</Text>
                <Ionicons name="chevron-down" size={22} color="#AAA" />
              </TouchableOpacity>
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
      </View>

      <Modal
        visible={statusVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusVisible(false)}
      >
        <TouchableOpacity
          style={styles.statusModalOverlay}
          activeOpacity={1}
          onPress={() => setStatusVisible(false)}
        >
          <View style={styles.statusModalCard}>
            {[STATUS_ACTIVE, STATUS_SUSPENDED].map(option => (
              <TouchableOpacity
                key={option}
                style={styles.statusOption}
                onPress={() => {
                  setStatus(option);
                  setStatusVisible(false);
                }}
              >
                <Text style={styles.statusOptionText}>{statusLabel(option)}</Text>
                {status === option ? (
                  <Ionicons name="checkmark" size={20} color={PURPLE} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
