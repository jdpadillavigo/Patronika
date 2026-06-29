import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import TutorialUseCase from '../../domain/usecases/TutorialUseCase';
import { tutorialesStyles as styles } from '../styles/TutorialesStyles';

export default function TutorialCard({ tutorial, actions }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoSource = useMemo(
    () => TutorialUseCase.getAllowedVideoSource(tutorial.url || ''),
    [tutorial.url]
  );

  return (
    <View style={styles.card}>
      {actions ? <View style={styles.cardActions}>{actions}</View> : null}

      <View style={styles.thumbnail}>
        {isPlaying && videoSource?.embedUrl ? (
          <WebView
            source={{
              uri: videoSource.embedUrl,
              headers: {
                Referer: 'https://com.patronika',
              },
            }}
            style={styles.videoPlayer}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        ) : (
          <TouchableOpacity
            style={styles.thumbnailTouchable}
            onPress={() => videoSource?.embedUrl && setIsPlaying(true)}
            activeOpacity={0.86}
            disabled={!videoSource?.embedUrl}
          >
            {videoSource?.thumbnailUrl ? (
              <Image source={{ uri: videoSource.thumbnailUrl }} style={styles.thumbnailImage} resizeMode="cover" />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="videocam-outline" size={32} color="#AAA" />
              </View>
            )}
            {videoSource?.embedUrl ? (
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={40} color="white" />
              </View>
            ) : null}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{tutorial.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{tutorial.description}</Text>
      </View>
    </View>
  );
}
