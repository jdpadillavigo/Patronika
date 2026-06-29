import React, { useEffect, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { userPreviewModalStyles as styles, PURPLE } from './UserPreviewModalStyles';

export default function UserPreviewModal({ visible, user, onClose }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = user?.avatar || user?.profileImageUrl || null;
  const showImage = !!imageUrl && !imageFailed;
  const role = user?.isAdmin ? 'ADMIN' : 'USUARIO';

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.card} activeOpacity={1}>
          <Text style={styles.roleText}>{role}</Text>

          <View style={styles.avatarFrame}>
            {showImage ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.avatarImage}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Ionicons name="person" size={78} color={PURPLE} />
            )}
          </View>

          <Text style={styles.username} numberOfLines={1}>{user?.username || 'Usuario'}</Text>
          <Text style={styles.email} numberOfLines={2}>{user?.email || 'Correo no disponible'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
