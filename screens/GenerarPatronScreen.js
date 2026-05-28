import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const PURPLE = '#7B3F7E';
const DARK_BANNER = '#1C1C1E';

export default function GenerarPatronScreen({ navigation }) {
  const onClose = () => navigation.goBack();
  const onSiguiente = () => navigation.navigate('Formulario', { imageUri: image });
  const [image, setImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowConfirmModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      {/* Header morado */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Generar patrón</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Subtítulo */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Adjunta una imagen desde tu galería</Text>
      </View>

      {/* Banner oscuro */}
      <View style={styles.banner}>
        <Ionicons name="help-circle" size={22} color="#4A9EDB" />
        <Text style={styles.bannerText}>Lea los términos y condiciones de uso</Text>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Área de imagen */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={pickImage}
          activeOpacity={0.85}
        >
          {image ? (
            <>
              <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
              <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
                <Ionicons name="pencil" size={14} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={64} color={PURPLE} />
              <Text style={styles.placeholderText}>Toca para seleccionar imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Botón Siguiente */}
        <TouchableOpacity
          style={[styles.button, !image && styles.buttonDisabled]}
          disabled={!image}
          onPress={() => navigation.navigate('Formulario', { imageUri: image })}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmación */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialCommunityIcons name="image-check-outline" size={64} color={PURPLE} />
            <Text style={styles.modalTitle}>
              {'¡Imagen cargada\ncorrectamente!'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 10,
    paddingBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitleContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  subtitle: {
    color: '#555',
    fontSize: 14,
  },
  banner: {
    backgroundColor: DARK_BANNER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PURPLE,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: PURPLE,
    borderRadius: 8,
    padding: 8,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placeholderText: {
    color: PURPLE,
    fontSize: 14,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4a2750',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
    lineHeight: 30,
  },
});
