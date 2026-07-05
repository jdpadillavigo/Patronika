import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { restablecerStyles as styles, PURPLE } from '../styles/ResetPasswordStyles';
import PasswordRecoveryUseCase from '../../domain/usecases/PasswordRecoveryUseCase';
import BackButton from '../../../../core/presentation/designsystem/components/BackButton';
import { useErrorPopup } from '../../../../core/presentation/designsystem/components/ErrorPopup';

export default function RestablecerContrasenaScreen({ navigation, route }) {
  const { email = '' } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showError, errorPopup } = useErrorPopup();

  const handleResetPassword = async () => {
    if (loading) return;

    setLoading(true);
    const result = await PasswordRecoveryUseCase.resetPassword(email, password, confirmPassword);
    setLoading(false);

    if (!result.success) {
      showError(result.error || 'No se pudo restablecer la contraseña');
      return;
    }

    setModalVisible(true);
  };

  const handleGoToLogin = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.safeArea}>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.contenido}>
        <Text style={styles.titulo}>Restablecer{'\n'}contraseña</Text>
        <Text style={styles.descripcion}>Ingrese su nueva contraseña.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#BDBDBD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            maxLength={80}
          />
          <TouchableOpacity onPress={() => setShowPassword(value => !value)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#BDBDBD"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repetir contraseña"
            placeholderTextColor="#BDBDBD"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            maxLength={80}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(value => !value)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#BDBDBD"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.boton, loading && styles.botonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.botonText}>{loading ? 'Restableciendo...' : 'Restablecer'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="lock-closed" size={36} color={PURPLE} />
              <View style={styles.modalIconBadge}>
                <Ionicons name="refresh" size={14} color={PURPLE} />
              </View>
            </View>

            <Text style={styles.modalTitulo}>¡Contraseña{'\n'}restablecida!</Text>

            <TouchableOpacity style={styles.modalBoton} onPress={handleGoToLogin}>
              <Text style={styles.modalBotonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {errorPopup}
    </View>
  );
}
