import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Image,
  InteractionManager,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system'; // FIX: API nueva de expo-file-system v19+ (la antigua FileSystem.writeAsStringAsync/EncodingType ya no existe)
import * as MediaLibrary from 'expo-media-library'; //nuevo import
import { misPatronesStyles as styles, PURPLE } from '../styles/MisPatronesStyles';
import PatternUseCase from '../../domain/usecases/PatternUseCase';
import { gridDataToImageUri } from '../utils/GridImage';
import BottomNavbar from '../components/BottomNavbar';
import { useErrorPopup } from '../components/ErrorPopup';

const PATTERN_ITEM_HEIGHT = 302;
const PATTERNS_PAGE_SIZE = 5;
const LOAD_MORE_DELAY_MS = 450;

async function downloadPatternImage(imageUri, patternName, showError) {
  if (!imageUri) {
    showError('La imagen del patrón aún no está lista. Intenta de nuevo en un momento.');
    return;
  }
 
  try {
    // Pide permiso para guardar en la galería del dispositivo
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para guardar el patrón.');
      return;
    }
 
    // El imageUri viene como "data:image/png;base64,XXXX" — separamos el base64 puro
    const base64Data = imageUri.split(',')[1];
    const fileName = `patron_${patternName.replace(/\s+/g, '_')}_${Date.now()}.png`;


    const file = new File(Paths.cache, fileName);
    file.write(base64Data, { encoding: 'base64' });
    const fileUri = file.uri;

    // Guarda el archivo en la galería del dispositivo (carpeta de fotos)
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync('Patrónika', asset, false);
 
    Alert.alert('¡Descargado!', 'El patrón se guardó en tu galería.');
  } catch (error) {
    // DEBUG TEMPORAL — quitar después de confirmar que funciona
    console.log('🔴 ERROR AL DESCARGAR:', error);
    console.log('Mensaje:', error?.message);
    // FIN DEBUG TEMPORAL
    showError('No se pudo descargar el patrón. Intenta de nuevo.');
  }
}

const PatternCardImage = memo(function PatternCardImage({ gridData, shouldRenderImage, onImageReady}) {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId = null;
    let interactionTask = null;

    if (!gridData || !shouldRenderImage) {
      setImageUri(null);
      return () => {
        mounted = false;
      };
    }

    setImageUri(null);
    interactionTask = InteractionManager.runAfterInteractions(() => {
      timeoutId = setTimeout(() => {
        const generatedUri = gridDataToImageUri(gridData, { maxDimension: 360 });
        if (mounted) {
          setImageUri(generatedUri);
          // NUEVO (Sprint 2): avisa al componente padre (PatternCard) que la imagen
          // ya está lista, para poder habilitar la descarga con el uri correcto
          if (onImageReady) onImageReady(generatedUri);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      interactionTask?.cancel?.();
    };
  }, [gridData, shouldRenderImage]);

  if (!imageUri) {
    return (
      <View style={[styles.cardImagen, styles.cardImagePlaceholder]}>
        <Ionicons name="image-outline" size={44} color={PURPLE} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={styles.cardImagen}
      resizeMode="contain"
    />
  );
});

const PatternCard = memo(function PatternCard({ pattern, shouldRenderImage,onDownload  }) {
  const [cardImageUri, setCardImageUri] = useState(null);
  return (
    <TouchableOpacity style={styles.cardPatron} activeOpacity={0.85}>
      <PatternCardImage gridData={pattern.gridData} shouldRenderImage={shouldRenderImage} onImageReady={setCardImageUri}/>
      
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => onDownload(cardImageUri, pattern.name)}
        activeOpacity={0.7}
      >
        <Ionicons name="download-outline" size={20} color="white" />
      </TouchableOpacity>

      <View style={styles.cardInfo}>
        <Text style={styles.cardNombre} numberOfLines={1}>{pattern.name}</Text>
        <Text style={styles.cardCreador} numberOfLines={1}>
          Creador: {pattern.user?.username || 'Tú'}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardValoracion}>Sin valoraciones</Text>
          <Text style={styles.cardDificultad}>Tamaño: {pattern.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function MisPatronesScreen({ navigation }) {
  const [activeNav, setActiveNav] = useState('patrones');
  const [patterns, setPatterns] = useState([]);
  const [visiblePatternCount, setVisiblePatternCount] = useState(PATTERNS_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewableBatchIndexes, setViewableBatchIndexes] = useState(() => new Set());
  const hasUserScrolledRef = useRef(false);
  const { showError, errorPopup } = useErrorPopup();

  const visiblePatterns = useMemo(
    () => patterns.slice(0, visiblePatternCount),
    [patterns, visiblePatternCount],
  );

  const hasMorePatterns = visiblePatternCount < patterns.length;

  const loadPatterns = useCallback(async () => {
    hasUserScrolledRef.current = false;
    setLoading(true);
    try {
      const result = await PatternUseCase.listMine();
      if (result.success) {
        setPatterns([...(result.data || [])].reverse());
        setVisiblePatternCount(PATTERNS_PAGE_SIZE);
      } else if (result.sessionExpired) {
        setPatterns([]);
        setVisiblePatternCount(PATTERNS_PAGE_SIZE);
      } else {
        showError(result.error || 'No se pudieron cargar tus patrones');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadPatterns();
  }, [loadPatterns]));

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  const renderPattern = useCallback(({ item, index }) => {
    const batchIndex = Math.floor(index / PATTERNS_PAGE_SIZE);

    return (
      <PatternCard
        pattern={item}
        shouldRenderImage={viewableBatchIndexes.has(batchIndex)}
        onDownload={(imageUri, patternName) => downloadPatternImage(imageUri, patternName, showError)}
      />
    );
  }, [viewableBatchIndexes,showError]);

  const renderSeparator = useCallback(() => (
    <View style={styles.patternSeparator} />
  ), []);

  const renderListFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.listFooter}>
        <ActivityIndicator size="small" color={PURPLE} />
        <Text style={styles.loadingMoreText}>Cargando...</Text>
      </View>
    );
  }, [loadingMore]);

  const handleLoadMorePatterns = useCallback(async () => {
    if (!hasUserScrolledRef.current || loading || loadingMore || !hasMorePatterns) return;

    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, LOAD_MORE_DELAY_MS));
    setVisiblePatternCount(currentCount => Math.min(currentCount + PATTERNS_PAGE_SIZE, patterns.length));
    hasUserScrolledRef.current = false;
    setLoadingMore(false);
  }, [hasMorePatterns, loading, loadingMore, patterns.length]);

  const handleScrollBeginDrag = useCallback(() => {
    hasUserScrolledRef.current = true;
  }, []);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    setViewableBatchIndexes(new Set(
      viewableItems
        .filter(item => typeof item.index === 'number')
        .map(item => Math.floor(item.index / PATTERNS_PAGE_SIZE))
    ));
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 35,
    minimumViewTime: 80,
  }).current;

  const getPatternLayout = useCallback((_, index) => ({
    length: PATTERN_ITEM_HEIGHT,
    offset: PATTERN_ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patrónika</Text>
      </View>

      <View style={styles.contenido}>
        {loading ? (
          <View style={styles.vacio}>
            <ActivityIndicator size="large" color={PURPLE} />
          </View>
        ) : activeNav === 'patrones' ? (
          patterns.length === 0 ? (
            <View style={styles.vacio}>
              <Text style={styles.vacioText}>No creaste patrones aún</Text>
            </View>
          ) : (
            <FlatList
              data={visiblePatterns}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listaPatrones}
              renderItem={renderPattern}
              ItemSeparatorComponent={renderSeparator}
              ListFooterComponent={renderListFooter}
              onEndReached={handleLoadMorePatterns}
              onEndReachedThreshold={0.05}
              onScrollBeginDrag={handleScrollBeginDrag}
              onViewableItemsChanged={handleViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={80}
              windowSize={7}
              removeClippedSubviews={false}
              getItemLayout={getPatternLayout}
            />
          )
        ) : (
          <View style={styles.vacio}>
            <Text style={styles.vacioText}>Próximamente</Text>
          </View>
        )}
      </View>

      <BottomNavbar
        activeItem="patterns"
        onPressPatterns={() => setActiveNav('patrones')}
        onPressCommunity={() => navigation.navigate('Comunidad')}
        onPressProfile={() => navigation.navigate('Perfil')}
        onPressCamera={handleFab}
      />
      {errorPopup}
    </SafeAreaView>
  );
}
