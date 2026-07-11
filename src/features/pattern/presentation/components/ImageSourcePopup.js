import React, { useMemo } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../core/presentation/designsystem/Theme';
import { createImageSourcePopupStyles } from '../styles/ImageSourcePopupStyles';

export default function ImageSourcePopup({ visible, onTakePhoto, onChooseFromLibrary, onCancel }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createImageSourcePopupStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="image" size={38} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Agregar imagen</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onTakePhoto}>
              <Text style={styles.actionButtonText}>Tomar una foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onChooseFromLibrary}>
              <Text style={styles.actionButtonText}>Desde la galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelAction} onPress={onCancel}>
              <Text style={styles.cancelActionText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
