import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, ActivityIndicator, Image, Modal, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import { misPatronesStyles as styles, PURPLE, CARD_WIDTH } from '../styles/MyPatternsStyles';
import PatternUseCase from '../../domain/usecases/PatternUseCase';
import PatternLibraryUseCase from '../../domain/usecases/PatternLibraryUseCase';
import PublicationUseCase from '../../../post/domain/usecases/PublicationUseCase';
import AppTopBar from '../../../../core/presentation/designsystem/components/AppTopBar';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import { useErrorPopup } from '../../../../core/presentation/designsystem/components/ErrorPopup';
import { REFRESH_TOP_BAR_OFFSET } from '../../../../core/presentation/designsystem/components/CommonStyles';

// --- Normalización de datos ---
function normalizeOwn(p, publishedIds) {
  return { id: p.id, name: p.name, gridData: p.gridData, displaySize: p.size || p.width, isSaved: false, isPublished: publishedIds.has(p.id) };
}
function normalizeSaved(entry, publishedIds) {
  return { id: entry.pattern.id, name: entry.pattern.name, gridData: entry.pattern.gridData, displaySize: entry.pattern.width, isSaved: true, isPublished: publishedIds.has(entry.pattern.id) };
}
function normalizeAll(p, currentUserId, publishedIds) {
  return { id: p.id, name: p.name, gridData: p.gridData, displaySize: p.width, isSaved: p.userId !== currentUserId, isPublished: publishedIds.has(p.id) };
}

// --- Tarjeta de patrón (grid Pinterest) ---
const GridCard = memo(function GridCard({ pattern, onPress }) {
  const uri = pattern.gridData
    ? gridDataToImageUri(pattern.gridData, { maxDimension: 300 })
    : null;
  const [imageLoading, setImageLoading] = useState(Boolean(uri));
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageLoading(Boolean(uri));
    setImageFailed(false);
  }, [uri]);

  return (
    <TouchableOpacity
      style={[styles.gridCard, { width: CARD_WIDTH }]}
      onPress={() => onPress(pattern)}
      activeOpacity={0.82}
    >
      <View style={[styles.gridCardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]}>
        {(!uri || imageLoading || imageFailed) ? (
          <View style={styles.gridCardPlaceholder}>
            <Ionicons name="image-outline" size={32} color={PURPLE} />
          </View>
        ) : null}
        {uri && !imageFailed ? (
          <Image
            source={{ uri }}
            style={styles.gridCardImg}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageFailed(true);
              setImageLoading(false);
            }}
          />
        ) : null}
        {pattern.isPublished && (
          <View style={styles.gridCardPublishedBadge}>
            <Ionicons name="earth" size={12} color="white" />
          </View>
        )}
        {pattern.isSaved && (
          <View style={styles.gridCardBadge}>
            <Ionicons name="bookmark" size={12} color="white" />
          </View>
        )}
      </View>
      <View style={styles.gridCardFooter}>
        <Text style={styles.gridCardName} numberOfLines={1}>{pattern.name}</Text>
      </View>
    </TouchableOpacity>
  );
});

// --- Pantalla principal ---
export default function MisPatronesScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const { showError, showPopup, showConfirm, errorPopup } = useErrorPopup();

  const loadPatterns = useCallback(async () => {
    setLoading(true);
    try {
      let normalized = [];

      const [publishedResult, patternsResult] = await Promise.all([
        PublicationUseCase.getMyPublishedPatternIds(),
        activeFilter === 'mios'
          ? PatternUseCase.listMine()
          : activeFilter === 'guardados'
          ? PatternLibraryUseCase.listSaved()
          : PatternLibraryUseCase.listAll(),
      ]);

      if (patternsResult.sessionExpired) { setPatterns([]); return; }

      const publishedIds = publishedResult.data ?? new Set();

      if (activeFilter === 'mios') {
        if (!patternsResult.success) { showError(patternsResult.error || 'No se pudieron cargar tus patrones'); return; }
        normalized = (patternsResult.data || []).map(p => normalizeOwn(p, publishedIds));
      } else if (activeFilter === 'guardados') {
        if (!patternsResult.success) { showError(patternsResult.error || 'No se pudieron cargar los patrones guardados'); return; }
        normalized = (patternsResult.data || []).map(e => normalizeSaved(e, publishedIds));
      } else {
        if (!patternsResult.success) {
          // Fallback a solo propios si listAll falla
          const mine = await PatternUseCase.listMine();
          normalized = mine.success ? (mine.data || []).map(p => normalizeOwn(p, publishedIds)) : [];
        } else {
          normalized = (patternsResult.data || []).map(p => normalizeAll(p, patternsResult.currentUserId, publishedIds));
        }
      }
      setPatterns([...normalized].reverse());
    } finally {
      setLoading(false);
    }
  }, [activeFilter, showError]);

  useFocusEffect(useCallback(() => {
    loadPatterns();
  }, [loadPatterns]));

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // --- Acciones del modal ---
  const handleViewFullscreen = useCallback(() => {
    setFullscreenVisible(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!selectedPattern?.gridData) {
      showPopup('Este patrón no tiene imagen para descargar', 'Sin imagen', { type: 'warning' });
      return;
    }
    setActionLoading('download');
    let cachedFile = null;
    try {
      // maxDimension 300 ya está cacheado desde la tarjeta → no bloquea el hilo JS
      const uri = gridDataToImageUri(selectedPattern.gridData, { maxDimension: 300 });
      if (!uri) {
        showError('No se pudo generar la imagen del patrón');
        return;
      }

      const base64 = uri.split(',')[1];
      const safeName = (selectedPattern.name || 'patron').replace(/[^a-zA-Z0-9]/g, '_');

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        showPopup(
          'Activa el permiso de fotos en Configuración para guardar el patrón',
          'Permiso denegado',
          { type: 'warning' },
        );
        return;
      }

      cachedFile = new File(Paths.cache, `patron_${safeName}_${Date.now()}.png`);
      cachedFile.write(base64, { encoding: 'base64' });

      const asset = await MediaLibrary.createAssetAsync(cachedFile.uri);
      await MediaLibrary.createAlbumAsync('Patrónika', asset, false);

      showPopup('El patrón se guardó en tu galería.', '¡Listo!', { type: 'success' });
    } catch (err) {
      showError(err.message || 'No se pudo descargar el patrón');
    } finally {
      if (cachedFile?.exists) cachedFile.delete();
      setActionLoading(null);
    }
  }, [selectedPattern, showError, showPopup]);

  const handleDelete = useCallback(() => {
    showConfirm(
      '¿Seguro que quieres eliminar este patrón? Esta acción no se puede deshacer.',
      'Eliminar patrón',
      async () => {
          setActionLoading('delete');
          const result = await PatternUseCase.discard(selectedPattern?.id);
          setActionLoading(null);
          if (result.success) {
            setSelectedPattern(null);
            loadPatterns();
          } else {
            showError(result.error || 'No se pudo eliminar el patrón');
          }
      },
      { acceptText: 'Eliminar' },
    );
  }, [selectedPattern, loadPatterns, showError, showConfirm]);

  const handleRemoveSaved = useCallback(() => {
    showConfirm(
      '¿Quitar este patrón de tus guardados?',
      'Quitar patrón',
      async () => {
          setActionLoading('remove');
          const result = await PatternLibraryUseCase.remove(selectedPattern?.id);
          setActionLoading(null);
          if (result.success) {
            setSelectedPattern(null);
            loadPatterns();
          } else {
            showError(result.error || 'No se pudo quitar el patrón');
          }
      },
      { acceptText: 'Quitar' },
    );
  }, [selectedPattern, loadPatterns, showError, showConfirm]);

  const closeModal = useCallback(() => {
    setFullscreenVisible(false);
    setSelectedPattern(null);
  }, []);

  // --- Columnas para el grid ---
  const leftCol = patterns.filter((_, i) => i % 2 === 0);
  const rightCol = patterns.filter((_, i) => i % 2 !== 0);

  const emptyText = activeFilter === 'guardados'
    ? 'No guardaste patrones aún'
    : activeFilter === 'mios'
    ? 'No creaste patrones aún'
    : 'No tienes patrones disponibles';

  // maxDimension 300 ya está cacheado desde cuando se renderizó la tarjeta → instantáneo
  const previewUri = selectedPattern?.gridData
    ? gridDataToImageUri(selectedPattern.gridData, { maxDimension: 300 })
    : null;

  return (
    <View style={styles.safeArea}>

      <AppTopBar />

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <TouchableOpacity
          style={[styles.filtroGrid, activeFilter === 'todos' && styles.filtroGridActivo]}
          onPress={() => handleFilterChange('todos')}
          activeOpacity={0.8}
        >
          <Ionicons name="grid" size={18} color={activeFilter === 'todos' ? 'white' : PURPLE} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroPill, activeFilter === 'guardados' && styles.filtroPillActivo]}
          onPress={() => handleFilterChange('guardados')}
          activeOpacity={0.8}
        >
          <Ionicons name="bookmark" size={14} color={activeFilter === 'guardados' ? 'white' : '#555'} />
          <Text style={[styles.filtroPillText, activeFilter === 'guardados' && styles.filtroPillTextActivo]}>
            Guardados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filtroPill, activeFilter === 'mios' && styles.filtroPillActivo]}
          onPress={() => handleFilterChange('mios')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filtroPillText, activeFilter === 'mios' && styles.filtroPillTextActivo]}>
            Creado por ti
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.contenido}>
        {loading ? (
          <ScreenState loading text="Cargando patrones..." />
        ) : patterns.length === 0 ? (
          <ScrollView
            style={styles.gridScroll}
            contentContainerStyle={styles.gridEmptyContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPatterns} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
          >
            <ScreenState iconName="grid-outline" text={emptyText} />
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.gridScroll}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPatterns} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
          >
            <View style={styles.gridColumns}>
              <View style={styles.gridColumn}>
                {leftCol.map(p => <GridCard key={p.id} pattern={p} onPress={setSelectedPattern} />)}
              </View>
              <View style={styles.gridColumn}>
                {rightCol.map(p => <GridCard key={p.id} pattern={p} onPress={setSelectedPattern} />)}
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Modal detalle */}
      <Modal
        visible={!!selectedPattern && !fullscreenVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={2}>{selectedPattern?.name}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
              <Ionicons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleViewFullscreen} activeOpacity={0.9}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.modalPreview} resizeMode="contain" />
            ) : (
              <View style={styles.modalPreviewPlaceholder}>
                <Ionicons name="grid-outline" size={64} color={PURPLE} />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleViewFullscreen}>
              <Ionicons name="expand-outline" size={20} color={PURPLE} />
              <Text style={styles.actionBtnText}>Ver más grande</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleDownload} disabled={!!actionLoading}>
              {actionLoading === 'download'
                ? <ActivityIndicator size="small" color={PURPLE} />
                : <Ionicons name="download-outline" size={20} color={PURPLE} />
              }
              <Text style={styles.actionBtnText}>Descargar en mi galería</Text>
            </TouchableOpacity>

            {selectedPattern?.isSaved ? (
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleRemoveSaved} disabled={!!actionLoading}>
                {actionLoading === 'remove'
                  ? <ActivityIndicator size="small" color="#E53935" />
                  : <Ionicons name="bookmark-outline" size={20} color="#E53935" />
                }
                <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Quitar de guardados</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleDelete} disabled={!!actionLoading}>
                {actionLoading === 'delete'
                  ? <ActivityIndicator size="small" color="#E53935" />
                  : <Ionicons name="trash-outline" size={20} color="#E53935" />
                }
                <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Eliminar patrón</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Fullscreen viewer */}
      <Modal visible={fullscreenVisible} transparent animationType="fade" onRequestClose={() => setFullscreenVisible(false)}>
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity style={styles.fullscreenClose} onPress={() => setFullscreenVisible(false)}>
            <Ionicons name="close" size={22} color="white" />
          </TouchableOpacity>
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.fullscreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <UserBottomBar
        activeItem={UserBottomNavigationItem.PATTERNS}
        onPressPatterns={() => {}}
        onPressCommunity={() => navigation.navigate('Comunidad')}
        onPressTutorials={() => navigation.navigate('Tutoriales')}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: false })}
        onPressCamera={() => navigation.navigate('GenerarPatron')}
      />
      {errorPopup}
    </View>
  );
}
