import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function ConfirmationModal({
  visible,
  title,
  iconName = 'trash-outline',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  loading = false,
  loadingText,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !loading && onCancel?.()}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name={iconName} size={30} color={PURPLE} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={loading}>
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} disabled={loading}>
              <Text style={styles.confirmButtonText}>
                {loading ? (loadingText || confirmText) : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  icon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
});
