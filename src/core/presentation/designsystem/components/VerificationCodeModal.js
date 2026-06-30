import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { errorPopupStyles as popupStyles, PURPLE } from './ErrorPopupStyles';

export default function VerificationCodeModal({
  visible,
  title,
  message,
  loading = false,
  onCancel,
  onResend,
  onSubmit,
}) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (visible) setCode(['', '', '', '']);
  }, [visible]);

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    if (digit && index < 3) inputs[index + 1].current?.focus();
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !loading && onCancel?.()}
    >
      <View style={popupStyles.modalOverlay}>
        <View style={popupStyles.modalCard}>
          <View style={popupStyles.modalIconContainer}>
            <Ionicons name="mail-outline" size={38} color={PURPLE} />
          </View>

          <Text style={popupStyles.modalTitle}>{title}</Text>
          {message ? <Text style={popupStyles.modalMessage}>{message}</Text> : null}

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputs[index]}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={event => handleKeyPress(event, index)}
                keyboardType="number-pad"
                maxLength={1}
                editable={!loading}
                textAlign="center"
                style={styles.codeInput}
              />
            ))}
          </View>

          <TouchableOpacity onPress={onResend} disabled={loading} style={styles.resendButton}>
            <Text style={styles.resendText}>Reenviar correo</Text>
          </TouchableOpacity>

          <View style={popupStyles.modalActions}>
            <TouchableOpacity style={popupStyles.modalSecondaryButton} onPress={onCancel} disabled={loading}>
              <Text style={popupStyles.modalSecondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[popupStyles.modalButton, popupStyles.modalButtonCompact]}
              onPress={() => onSubmit?.(code.join(''))}
              disabled={loading}
            >
              <Text style={popupStyles.modalButtonText}>{loading ? 'Actualizando...' : 'Actualizar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  codeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  codeInput: {
    width: 46,
    height: 46,
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 8,
    color: '#111',
    fontSize: 22,
    fontWeight: '800',
  },
  resendButton: {
    marginBottom: 22,
  },
  resendText: {
    color: PURPLE,
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
