import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verificarCorreoStyles as styles, PURPLE } from '../styles/VerifyEmailStyles';
import RegisterUseCase from '../../../register/domain/usecases/RegisterUseCase';
import PasswordRecoveryUseCase from '../../../../resetPassword/domain/usecases/PasswordRecoveryUseCase';
import BackButton from '../../../../../core/presentation/designsystem/components/BackButton';
import { useErrorPopup } from '../../../../../core/presentation/designsystem/components/ErrorPopup';

export default function VerificarCorreoScreen({ navigation, route }) {
  const { mode = 'recovery', email, username, password, profileImageUri } = route.params || {};
  const codeLength = 6;

  // 6 inputs separados para el código de verificación
  const [codigo, setCodigo] = useState(Array(codeLength).fill(''));
  const inputs = useRef([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const { showError, errorPopup } = useErrorPopup();

  // Maneja el cambio en cada casilla del código
  const handleCambioDigito = (texto, index) => {
    const digito = texto.replace(/[^0-9]/g, '').slice(-1);
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = digito;
    setCodigo(nuevoCodigo);
    // Auto-avanza al siguiente input si se escribió un dígito
    if (digito && index < codeLength - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerificar = async () => {
    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length < codeLength) {
      showError('Por favor ingresa el código completo');
      return;
    }

    if (mode === 'register') {
      const verified = await RegisterUseCase.verifyCode(email, codigoCompleto);
      if (!verified.success) {
        showError(verified.error || 'No se pudo verificar el código');
        return;
      }

      const registered = await RegisterUseCase.complete(username, email, password, profileImageUri);
      if (!registered.success) {
        showError(registered.error || 'No se pudo crear la cuenta');
        return;
      }

      setModalVisible(true);
      return;
    }

    const result = await PasswordRecoveryUseCase.verifyCode(email, codigoCompleto);
    if (!result.success) {
      showError(result.error || 'No se pudo verificar el código');
      return;
    }

    navigation.navigate('RestablecerContrasena', { email });
  };

  const handleIrAMisPatrones = () => {
    setModalVisible(false);
    navigation.replace('MisPatrones');
  };

  const handleReenviar = async () => {
    const result = mode === 'register'
      ? await RegisterUseCase.requestCode(username, email, password, password)
      : await PasswordRecoveryUseCase.requestCode(email);

    if (!result.success) {
      showError(result.error || 'No se pudo reenviar el código');
      return;
    }

    setResendModalVisible(true);
  };

  return (
    <View style={styles.safeArea}>

      {/* Botón Volver regresa a la pantalla anterior del flujo */}
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.contenido}>

        {/* Título y descripción */}
        <Text style={styles.titulo}>Verificar correo{'\n'}electrónico</Text>
        <Text style={styles.descripcion}>
          Introduce el código de verificación enviado a tu correo.
        </Text>

        {/* 6 casillas separadas para el código */}
        <View style={styles.codigoContainer}>
          {codigo.map((digito, index) => (
            <TextInput
              key={index}
              ref={input => {
                inputs.current[index] = input;
              }}
              style={styles.codigoCasilla}
              value={digito}
              onChangeText={texto => handleCambioDigito(texto, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {/* Botón verificar */}
        <TouchableOpacity style={styles.boton} onPress={handleVerificar}>
          <Text style={styles.botonText}>Verificar</Text>
        </TouchableOpacity>

        {/* Link reenviar código */}
        <TouchableOpacity onPress={handleReenviar}>
          <Text style={styles.reenviarText}>Reenviar código</Text>
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
              <Ionicons name="checkmark-circle" size={36} color={PURPLE} />
            </View>

            <Text style={styles.modalTitulo}>Cuenta creada{'\n'}exitosamente</Text>

            <TouchableOpacity style={styles.modalBoton} onPress={handleIrAMisPatrones}>
              <Text style={styles.modalBotonText}>Continuar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <Modal
        visible={resendModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <View style={styles.modalIconContainer}>
              <Ionicons name="mail" size={36} color={PURPLE} />
            </View>

            <Text style={styles.modalTitulo}>Código reenviado{'\n'}correctamente</Text>

            <TouchableOpacity style={styles.modalBoton} onPress={() => setResendModalVisible(false)}>
              <Text style={styles.modalBotonText}>Continuar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      {errorPopup}

    </View>
  );
}
