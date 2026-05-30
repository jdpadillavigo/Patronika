import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { generarPatronStyles as styles, PURPLE } from '../styles';

export default function GenerarPatronScreen({ navigation }) {
  const onClose = () => navigation.goBack();
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

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Generar patrón</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Adjunta una imagen desde tu galería</Text>
      </View>

      <View style={styles.banner}>
        <Ionicons name="help-circle" size={22} color="#4A9EDB" />
        <Text style={styles.bannerText}>Lea los términos y condiciones de uso</Text>
      </View>

      <View style={styles.content}>
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

        <TouchableOpacity
          style={[styles.button, !image && styles.buttonDisabled]}
          disabled={!image}
          onPress={() => navigation.navigate('Formulario', { imageUri: image })}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

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
