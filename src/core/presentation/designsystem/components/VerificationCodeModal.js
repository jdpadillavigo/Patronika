import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { createErrorPopupStyles, PURPLE } from './ErrorPopupStyles';
import { useAppTheme } from '../Theme';

export default function VerificationCodeModal({
  visible,
  title,
  message,
  loading = false,
  submitText = 'Continuar',
  loadingText = 'Verificando...',
  onCancel,
  onResend,
  onSubmit,
}) {
  const { colors } = useAppTheme();
  const popupStyles = useMemo(() => createErrorPopupStyles(colors), [colors]);
  const codeLength = 6;
  const [code, setCode] = useState(Array(codeLength).fill(''));
  const [resendVisible, setResendVisible] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (visible) setCode(Array(codeLength).fill(''));
  }, [visible, codeLength]);

  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    if (digit && index < codeLength - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    const result = await onResend?.();
    if (result !== false) setResendVisible(true);
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
            <Ionicons name="mail" size={38} color={PURPLE} />
          </View>

          <Text style={popupStyles.modalTitle}>{title}</Text>
          {message ? <Text style={popupStyles.modalMessage}>{message}</Text> : null}

          <View style={styles.codeRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={input => {
                  inputs.current[index] = input;
                }}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={event => handleKeyPress(event, index)}
                keyboardType="number-pad"
                maxLength={1}
                editable={!loading}
                textAlign="center"
                style={[styles.codeInput, { color: colors.textStrong }]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleResend} disabled={loading} style={styles.resendButton}>
            <Text style={styles.resendText}>Reenviar código</Text>
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
              <Text style={popupStyles.modalButtonText}>{loading ? loadingText : submitText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        visible={resendVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResendVisible(false)}
      >
        <View style={popupStyles.modalOverlay}>
          <View style={popupStyles.modalCard}>
            <View style={popupStyles.modalIconContainer}>
              <Ionicons name="mail" size={38} color={PURPLE} />
            </View>
            <Text style={popupStyles.modalTitle}>Código reenviado</Text>
            <TouchableOpacity style={popupStyles.modalButton} onPress={() => setResendVisible(false)}>
              <Text style={popupStyles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  codeRow: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 14,
  },
  codeInput: {
    width: 36,
    height: 44,
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 8,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
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
