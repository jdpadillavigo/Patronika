import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { crearStyles as styles, PURPLE } from '../styles/CreatePostStyles';
import PatternUseCase from '../../../pattern/domain/usecases/PatternUseCase';
import PatternLibraryUseCase from '../../../pattern/domain/usecases/PatternLibraryUseCase';
import PublicationUseCase from '../../domain/usecases/PublicationUseCase';
import HttpClient from '../../../../core/data/network/HttpClientExt';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';
import BackButton from '../../../../core/presentation/designsystem/components/BackButton';
import { useErrorPopup } from '../../../../core/presentation/designsystem/components/ErrorPopup';

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
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingPatterns, setLoadingPatterns] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [description, setDescription] = useState('');
  const [technique, setTechnique] = useState(0);
  const [customTechnique, setCustomTechnique] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const { showError, errorPopup } = useErrorPopup();

  useEffect(() => {
    async function load() {
      const [user, mineResult, savedResult] = await Promise.all([
        HttpClient.getCurrentUser(),
        PatternUseCase.listMine(),
        PatternLibraryUseCase.listSaved(),
      ]);

      const uid = user?.id || null;
      setCurrentUserId(uid);

      const ownPatterns = mineResult.success
        ? (mineResult.data || []).map(p => ({
            id: p.id,
            name: p.name,
            gridData: p.gridData,
            userId: p.user?.id || uid,
            isSavedPattern: false,
          }))
        : [];

      const savedPatterns = savedResult.success
        ? (savedResult.data || []).map(entry => ({
            id: entry.pattern.id,
            name: entry.pattern.name,
            gridData: entry.pattern.gridData,
            userId: entry.pattern.userId,
            isSavedPattern: true,
          }))
        : [];

      const ownIds = new Set(ownPatterns.map(p => p.id));
      const combined = [...ownPatterns, ...savedPatterns.filter(p => !ownIds.has(p.id))];
      setPatterns(combined);
      setLoadingPatterns(false);
    }
    load();
  }, []);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Se necesita permiso para acceder a la galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }, [showError]);

  const handlePublish = async () => {
    if (!selectedPattern) { showError('Selecciona un patrón para publicar'); return; }
    if (!description.trim()) { showError('Escribe una descripción'); return; }
    if (selectedPattern.isSavedPattern && !imageUri) {
      showError('Debes agregar una foto de tu resultado para publicar un patrón de otro usuario');
      return;
    }
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

  const isSavedPattern = selectedPattern?.isSavedPattern === true;
  const canPublish = selectedPattern && description.trim().length > 0 && !publishing && (!isSavedPattern || imageUri);

  return (
    <View style={styles.safeArea}>

      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
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
                {patterns.map(p => {
                  const isSaved = currentUserId && p.userId !== currentUserId;
                  return (
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
                      {isSaved && (
                        <View style={styles.savedLabel}>
                          <Ionicons name="bookmark" size={10} color={PURPLE} />
                          <Text style={styles.savedLabelText}>Guardado</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
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
              scrollEnabled={false}
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

          {/* Foto del resultado */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {isSavedPattern ? 'Foto de tu resultado *' : 'Foto del resultado (opcional)'}
            </Text>
            {isSavedPattern && !imageUri && (
              <Text style={styles.savedPatternNote}>
                Como es un patrón de otro usuario, debes mostrar tu propio resultado
              </Text>
            )}
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
    </View>
  );
}
