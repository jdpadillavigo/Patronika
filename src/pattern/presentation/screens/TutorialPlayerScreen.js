import React from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const PURPLE = '#763A6C';
const SCREEN_WIDTH = Dimensions.get('window').width;
const THUMBNAIL_HEIGHT = SCREEN_WIDTH * (9 / 16);

function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
}

export default function TutorialPlayerScreen({ route, navigation }) {
  const { tutorial } = route.params;

  const videoId = getYouTubeId(tutorial.url);
  const thumbnailUri = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const handlePlay = async () => {
    await WebBrowser.openBrowserAsync(tutorial.url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{tutorial.title}</Text>
      </View>

      {/* Miniatura con botón de play */}
      <TouchableOpacity style={styles.thumbnailContainer} onPress={handlePlay} activeOpacity={0.9}>
        {thumbnailUri ? (
          <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="videocam-outline" size={48} color="#555" />
          </View>
        )}
        {/* Overlay oscuro + botón play */}
        <View style={styles.playOverlay}>
          <View style={styles.playBtn}>
            <Ionicons name="play" size={36} color="white" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{tutorial.title}</Text>
        <Text style={styles.infoDescription}>{tutorial.description}</Text>

        <TouchableOpacity style={styles.watchBtn} onPress={handlePlay}>
          <Ionicons name="logo-youtube" size={20} color="white" />
          <Text style={styles.watchBtnText}>Ver tutorial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  thumbnailContainer: {
    width: SCREEN_WIDTH,
    height: THUMBNAIL_HEIGHT,
    backgroundColor: '#111',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    gap: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 12,
  },
  watchBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
