import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AUTH_GRADIENTS, absoluteFill } from './CommonStyles';

const ANIMATION_DURATION = 15000;

export default function AuthGradientBackground() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: AUTH_GRADIENTS.length,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      })
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <View style={absoluteFill}>
      {AUTH_GRADIENTS.map((colors, index) => {
        const opacity = progress.interpolate({
          inputRange: [0, 1, 2, 3],
          outputRange: [
            index === 0 ? 1 : 0,
            index === 1 ? 1 : 0,
            index === 2 ? 1 : 0,
            index === 0 ? 1 : 0,
          ],
        });

        return (
          <Animated.View key={colors.join('-')} style={[absoluteFill, { opacity }]}>
            <LinearGradient colors={colors} style={absoluteFill} />
          </Animated.View>
        );
      })}
    </View>
  );
}
