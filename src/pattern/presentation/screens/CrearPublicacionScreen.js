import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  SafeAreaView, StatusBar, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { crearStyles as styles, PURPLE } from '../styles/CrearPublicacionStyles';
import PatternUseCase from '../../domain/usecases/PatternUseCase';
import PublicationUseCase from '../../domain/usecases/PublicationUseCase';
import { gridDataToImageUri } from '../utils/GridImage';
import { useErrorPopup } from '../components/ErrorPopup';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

function PatternThumb({ pattern }) {
  const uri = pattern.gridData ? gridDataToImageUri(pattern.gridData, { maxDimension: 220 }) : null;
  if (uri) return <Image source={{ uri }} style={styles.patternThumb} resizeMode="cover" />;
  return (
    <View style={styles.patternThumbPlaceholder}>
      <Ionicons name="grid-outline" size={28} color={PURPLE} />
    </View>
  );
}

export default function CrearPublicacionScreen({ navigation }) {
  const [patterns, setPatterns] = useState([]);
  const [loadingPatterns, setLoadingPatterns] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [description, setDescription] = useState('');
  const [technique, setTechnique] = useState(0);
  const [customTechnique, setCustomTechnique] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const { showError, errorPopup } = useErrorPopup();

  useEffect(() => {
    PatternUseCase.listMine().then(result => {
      if (result.success) setPatterns(result.data);
      setLoadingPatterns(false);
    });
  }, []);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Se necesita permiso para acceder a la galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }, [showError]);

  const handlePublish = async () => {
    if (!selectedPattern) { showError('Selecciona un patrón para publicar'); return; }
    if (!description.trim()) { showError('Escribe una descripción'); return; }
    setPublishing(true);
    const result = await PublicationUseCase.create(selectedPattern.id, description, technique, imageUri);
    setPublishing(false);
    if (!result.success) {
      if (result.sessionExpired) return;
      showError(result.error || 'No se pudo publicar');
      return;
    }
    navigation.navigate('Comunidad');
  };

  const canPublish = selectedPattern && description.trim().length > 0 && !publishing;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva publicación</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selección de patrón */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Patrón a compartir *</Text>
            {loadingPatterns ? (
              <ActivityIndicator color={PURPLE} />
            ) : patterns.length === 0 ? (
              <Text style={styles.noPatterns}>No tienes patrones generados aún</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.patternList}>
                {patterns.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.patternCard, selectedPattern?.id === p.id && styles.patternCardSelected]}
                    onPress={() => setSelectedPattern(p)}
                    activeOpacity={0.8}
                  >
                    <PatternThumb pattern={p} />
                    <Text
                      style={[styles.patternCardName, selectedPattern?.id === p.id && styles.patternCardNameSelected]}
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descripción *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Cuéntanos sobre este patrón..."
              placeholderTextColor="#BBB"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
            />
          </View>

          {/* Técnica */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Técnica</Text>
            <View style={styles.techniqueRow}>
              {TECHNIQUES.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.techniquePill, technique === i && styles.techniquePillSelected]}
                  onPress={() => setTechnique(i)}
                >
                  <Text style={[styles.techniquePillText, technique === i && styles.techniquePillTextSelected]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {technique === 4 && (
              <TextInput
                style={styles.otrosInput}
                placeholder="Escribe la técnica..."
                placeholderTextColor="#BBB"
                value={customTechnique}
                onChangeText={setCustomTechnique}
                maxLength={60}
              />
            )}
          </View>

          {/* Foto opcional */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Foto del resultado (opcional)</Text>
            {imageUri ? (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: imageUri }} style={styles.selectedImage} resizeMode="cover" />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                <Ionicons name="camera-outline" size={28} color="#AAA" />
                <Text style={styles.imagePickerText}>Agregar foto del tejido terminado</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botón publicar */}
          <TouchableOpacity
            style={[styles.submitBtn, !canPublish && styles.submitBtnDisabled]}
            onPress={handlePublish}
            disabled={!canPublish}
          >
            {publishing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.submitBtnText}>Publicando...</Text>
              </View>
            ) : (
              <Text style={styles.submitBtnText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {errorPopup}
    </SafeAreaView>
  );
}
