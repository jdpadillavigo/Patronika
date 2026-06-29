import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import { tutorialesStyles as styles, PURPLE } from '../styles/TutorialesStyles';
import TutorialUseCase from '../../domain/usecases/TutorialUseCase';

function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

function TutorialCard({ tutorial, onPress }) {
  const videoId = getYouTubeId(tutorial.url);
  const thumbnailUri = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Miniatura del video */}
      <View style={styles.thumbnail}>
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} resizeMode="cover" />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="videocam-outline" size={32} color="#AAA" />
          </View>
        )}
        {/* Ícono de play encima de la miniatura */}
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={40} color="white" />
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{tutorial.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{tutorial.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TutorialesScreen({ navigation }) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTutorials = useCallback(async () => {
    setLoading(true);
    const result = await TutorialUseCase.getAll();
    if (result.success) setTutorials(result.data);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadTutorials();
  }, [loadTutorials]));

  return (
    <View style={styles.safeArea}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tutoriales</Text>
        <Text style={styles.headerSubtitle}>Aprende técnicas de tejido paso a paso</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      ) : tutorials.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="book-outline" size={52} color="#DDD" />
          <Text style={styles.emptyText}>Sin tutoriales aún</Text>
          <Text style={styles.emptySubtext}>Vuelve pronto para ver contenido nuevo</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {tutorials.map(t => (
            <TutorialCard
              key={t.id}
              tutorial={t}
              onPress={() => navigation.navigate('TutorialPlayer', { tutorial: t })}
            />
          ))}
        </ScrollView>
      )}

      <UserBottomBar
        activeItem={UserBottomNavigationItem.TUTORIALS}
        onPressPatterns={() => navigation.navigate('MisPatrones')}
        onPressCommunity={() => navigation.navigate('Comunidad')}
        onPressTutorials={() => {}}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: false })}
        onPressCamera={() => navigation.navigate('GenerarPatron')}
      />
    </View>
  );
}
