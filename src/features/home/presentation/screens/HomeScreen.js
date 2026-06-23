import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { homeStyles as styles, PURPLE } from '../styles/HomeStyles';
import { UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import PublicationUseCase from '../../../post/domain/usecases/PublicationUseCase';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import { gridDataToImageUri } from '../../../../core/presentation/designsystem/utils/GridImage';

const TECHNIQUES = ['Crochet', 'Tejido a dos agujas', 'Bordado', 'Macramé', 'Otros'];

// Muestra la foto de perfil del autor si está disponible (profileImageUrl del backend).
// Si no tiene foto, muestra un círculo con la inicial del nombre.
function AvatarCircle({ username, imageUrl }) {
  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={styles.cardAvatarImage} />;
  }
  return (
    <View style={styles.cardAvatar}>
      <Text style={styles.cardAvatarText}>
        {(username || '?')[0].toUpperCase()}
      </Text>
    </View>
  );
}

function PublicationCard({ pub, onPress, tall }) {
  const imageUri = pub.imageUrl
    || (pub.pattern?.gridData ? gridDataToImageUri(pub.pattern.gridData, { maxDimension: 300 }) : null);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.cardImage, tall && styles.cardImageTall]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cardPlaceholder, tall && styles.cardImageTall]}>
          <Ionicons name="image-outline" size={36} color={PURPLE} />
        </View>
      )}
      <View style={styles.cardInfo}>
        {TECHNIQUES[pub.technique] && (
          <View style={styles.techniqueBadge}>
            <Text style={styles.techniqueBadgeText}>{TECHNIQUES[pub.technique]}</Text>
          </View>
        )}
        <Text style={styles.cardDesc} numberOfLines={2}>{pub.description}</Text>
        <View style={styles.cardAuthorRow}>
          <AvatarCircle username={pub.user?.username} imageUrl={pub.user?.profileImageUrl} />
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
    if (result.success) setPublications(result.data);
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comunidad</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CrearPublicacion')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      ) : publications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={56} color="#CCC" />
          <Text style={styles.emptyText}>Aún no hay publicaciones</Text>
          <Text style={styles.emptySubtext}>
            Sé el primero en compartir un patrón con la comunidad
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} tintColor={PURPLE} />}
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
        onPressProfile={() => navigation.navigate('Perfil')}
        onPressCamera={() => navigation.navigate('GenerarPatron')}
      />
    </View>
  );
}
