import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { homeStyles as styles, PURPLE } from '../styles/HomeStyles';
import { UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import AppTopBar from '../../../../core/presentation/designsystem/components/AppTopBar';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import PublicationUseCase from '../../../post/domain/usecases/PublicationUseCase';
import PatternUseCase from '../../../pattern/domain/usecases/PatternUseCase';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';
import { REFRESH_TOP_BAR_OFFSET } from '../../../../core/presentation/designsystem/components/CommonStyles';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

function AvatarCircle({ imageUrl }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (imageUrl && !imageFailed) {
    return <Image source={{ uri: imageUrl }} style={styles.cardAvatarImage} onError={() => setImageFailed(true)} />;
  }
  return (
    <View style={styles.cardAvatar}>
      <Ionicons name="person" size={13} color="white" />
    </View>
  );
}

function PublicationCard({ pub, onPress, tall }) {
  const imageUri = pub.imageUrl
    || (pub.patternGridData ? gridDataToImageUri(pub.patternGridData, { maxDimension: 300 }) : null);
  const [imageLoading, setImageLoading] = useState(Boolean(imageUri));
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageLoading(Boolean(imageUri));
    setImageFailed(false);
  }, [imageUri]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.cardImage, tall && styles.cardImageTall]}>
        {(!imageUri || imageLoading || imageFailed) ? (
          <View style={styles.cardPlaceholder}>
            <Ionicons name="image-outline" size={36} color={PURPLE} />
          </View>
        ) : null}
        {imageUri && !imageFailed ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.cardImageContent}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageFailed(true);
              setImageLoading(false);
            }}
          />
        ) : null}
      </View>
      <View style={styles.cardInfo}>
        {TECHNIQUES[pub.technique] && (
          <View style={styles.techniqueBadge}>
            <Text style={styles.techniqueBadgeText}>{TECHNIQUES[pub.technique]}</Text>
          </View>
        )}
        <Text style={styles.cardDesc} numberOfLines={2}>{pub.description}</Text>
        <View style={styles.cardAuthorRow}>
          <AvatarCircle imageUrl={pub.user?.profileImageUrl} />
          <Text style={styles.cardAuthor}>@{pub.user?.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    const result = await PublicationUseCase.loadFeed();
    if (result.success) {
      const pubs = result.data;
      const uniquePatternIds = [...new Set(
        pubs.filter(p => !p.imageUrl && p.patternId).map(p => p.patternId)
      )];

      const patternGridMap = {};
      await Promise.all(uniquePatternIds.map(async (id) => {
        const res = await PatternUseCase.getById(id);
        if (res.success && res.data?.gridData) {
          patternGridMap[id] = res.data.gridData;
        }
      }));

      setPublications(pubs.map(pub => ({
        ...pub,
        patternGridData: patternGridMap[pub.patternId] || null,
      })));
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadFeed();
  }, [loadFeed]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed(true);
  }, [loadFeed]);

  const leftCol = publications.filter((_, i) => i % 2 === 0);
  const rightCol = publications.filter((_, i) => i % 2 !== 0);

  return (
    <View style={styles.safeArea}>
      <AppTopBar
        subtitle="Comunidad"
        description="Crea y explora patrones de la comunidad"
        rightAction={(
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('CrearPublicacion')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add" size={22} color="white" />
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ScreenState loading text="Cargando publicaciones..." />
      ) : publications.length === 0 ? (
        <ScreenState
          iconName="people-outline"
          text="Aún no hay publicaciones"
          subtext="Sé el primero en compartir un patrón con la comunidad"
        />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
        >
          <View style={styles.columns}>
            <View style={styles.column}>
              {leftCol.map((pub, i) => (
                <PublicationCard
                  key={pub.id}
                  pub={pub}
                  tall={i % 3 === 0}
                  onPress={() => navigation.navigate('PublicacionDetalle', { publicationId: pub.id, publication: pub })}
                />
              ))}
            </View>
            <View style={styles.column}>
              {rightCol.map((pub, i) => (
                <PublicationCard
                  key={pub.id}
                  pub={pub}
                  tall={i % 3 === 1}
                  onPress={() => navigation.navigate('PublicacionDetalle', { publicationId: pub.id, publication: pub })}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <UserBottomBar
        activeItem={UserBottomNavigationItem.COMMUNITY}
        onPressPatterns={() => navigation.navigate('MisPatrones')}
        onPressCommunity={() => undefined}
        onPressTutorials={() => navigation.navigate('Tutoriales')}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: false })}
        onPressCamera={() => navigation.navigate('GenerarPatron')}
      />
    </View>
  );
}
