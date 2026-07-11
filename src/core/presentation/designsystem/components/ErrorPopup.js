import React, { useCallback, useMemo, useState } from 'react';
import { useAppTheme } from '../Theme';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { createErrorPopupStyles, errorPopupStyles as styles, PURPLE } from './ErrorPopupStyles';

export function useErrorPopup() {
  const [popupState, setPopupState] = useState({
    visible: false,
    title: 'Error',
    message: '',
    type: 'error',
    acceptText: 'Aceptar',
    cancelText: null,
    onAccept: null,
    iconName: null,
  });

  const hidePopup = useCallback(() => {
    setPopupState(current => ({ ...current, visible: false }));
  }, []);

  const showPopup = useCallback((message, title = 'Aviso', options = {}) => {
    setPopupState({
      visible: true,
      title,
      message: message || '',
      type: options.type || 'info',
      acceptText: options.acceptText || 'Aceptar',
      cancelText: options.cancelText || null,
      onAccept: options.onAccept || null,
      iconName: options.iconName || null,
    });
  }, []);

  const showError = useCallback((message, title = 'Error') => {
    showPopup(message || 'Ocurrió un error inesperado', title, { type: 'error' });
  }, [showPopup]);

  const showConfirm = useCallback((message, title, onAccept, options = {}) => {
    showPopup(message, title, {
      type: options.type || 'warning',
      acceptText: options.acceptText || 'Aceptar',
      cancelText: options.cancelText || 'Cancelar',
      onAccept,
      iconName: options.iconName || null,
    });
  }, [showPopup]);

  const acceptPopup = useCallback(() => {
    const onAccept = popupState.onAccept;
    hidePopup();
    onAccept?.();
  }, [hidePopup, popupState.onAccept]);

  const errorPopup = useMemo(() => (
    <ErrorPopup
      visible={popupState.visible}
      title={popupState.title}
      message={popupState.message}
      type={popupState.type}
      acceptText={popupState.acceptText}
      cancelText={popupState.cancelText}
      onAccept={acceptPopup}
      onCancel={popupState.cancelText ? hidePopup : null}
      iconName={popupState.iconName}
    />
  ), [acceptPopup, hidePopup, popupState]);

  return { showError, showPopup, showConfirm, errorPopup };
}

export default function ErrorPopup({visible,
  title = 'Error',
  message,
  type = 'error',
  acceptText = 'Aceptar',
  cancelText,
  onAccept,
  onCancel,
  iconName,
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createErrorPopupStyles(colors), [colors]);
  const defaultIconName = type === 'success'
    ? 'checkmark-circle'
    : type === 'info'
    ? 'information-circle'
    : type === 'warning'
    ? 'warning'
    : 'alert-outline';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onAccept}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconContainer}>
            <Ionicons name={iconName || defaultIconName} size={38} color={PURPLE} />
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          {message ? <Text style={styles.modalMessage}>{message}</Text> : null}

          <View style={styles.modalActions}>
            {onCancel ? (
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={onCancel}>
                <Text style={styles.modalSecondaryButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[styles.modalButton, onCancel && styles.modalButtonCompact]}
              onPress={onAccept}
            >
              <Text style={styles.modalButtonText}>{acceptText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
