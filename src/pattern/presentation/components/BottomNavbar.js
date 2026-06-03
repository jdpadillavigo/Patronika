import React from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { bottomNavbarStyles as styles, PURPLE } from '../styles/BottomNavbarStyles';

const FAB_SIZE = 62;

export default function BottomNavbar({
  activeItem,
  onPressPatterns,
  onPressProfile,
  onPressCamera,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const isPatternsActive = activeItem === 'patterns';
  const isProfileActive = activeItem === 'profile';

  return (
    <View style={styles.navBar}>
      <View style={styles.navLeft}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={onPressPatterns}
          activeOpacity={0.75}
        >
          <Ionicons name="grid-outline" size={24} color={isPatternsActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isPatternsActive && styles.navLabelActive]}>
            Patrones
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navRight}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={onPressProfile}
          activeOpacity={0.75}
        >
          <Ionicons name="person-outline" size={24} color={isProfileActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isProfileActive && styles.navLabelActive]}>
            Mi perfil
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.fab, { left: (windowWidth - FAB_SIZE) / 2 }]}
        onPress={onPressCamera}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="camera-plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
