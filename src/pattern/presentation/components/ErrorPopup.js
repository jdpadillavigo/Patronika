import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { errorPopupStyles as styles, PURPLE } from '../styles/ErrorPopupStyles';

export function useErrorPopup() {
  const [errorState, setErrorState] = useState({
    visible: false,
    title: 'Error',
    message: '',
  });

  const showError = useCallback((message, title = 'Error') => {
    setErrorState({
      visible: true,
      title,
      message: message || 'Ocurrió un error inesperado',
    });
  }, []);

  const hideError = useCallback(() => {
    setErrorState(current => ({ ...current, visible: false }));
  }, []);

  const errorPopup = useMemo(() => (
    <ErrorPopup
      visible={errorState.visible}
      title={errorState.title}
      message={errorState.message}
      onAccept={hideError}
    />
  ), [errorState, hideError]);

  return { showError, errorPopup };
}

export default function ErrorPopup({
  visible,
  title = 'Error',
  message,
  onAccept,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onAccept}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconContainer}>
            <Ionicons name="alert-outline" size={38} color={PURPLE} />
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          {message ? <Text style={styles.modalMessage}>{message}</Text> : null}

          <TouchableOpacity style={styles.modalButton} onPress={onAccept}>
            <Text style={styles.modalButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
