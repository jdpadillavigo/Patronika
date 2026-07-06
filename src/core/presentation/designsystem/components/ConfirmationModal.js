import React from 'react';
import Colors from '../Colors';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';
import { useAppTheme } from '../Theme';

export default function ConfirmationModal({
  visible,
  title,
  iconName = 'trash',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  loading = false,
  loadingText,
  onCancel,
  onConfirm,
}) {
  const { colors } = useAppTheme();
  const filledIconName = typeof iconName === 'string' ? iconName.replace('-outline', '') : iconName;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !loading && onCancel?.()}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          <View style={styles.icon}>
            <Ionicons name={filledIconName} size={30} color={PURPLE} />
          </View>
          <Text style={[styles.title, { color: colors.textHeading }]}>{title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.surface }]} onPress={onCancel} disabled={loading}>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    elevation: 10,
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
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.fixedWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});
