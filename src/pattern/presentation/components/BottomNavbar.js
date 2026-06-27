
import React from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PURPLE } from '../styles/BottomNavbarStyles';
import { bottomNavbarStyles as styles } from '../styles/BottomNavbarStyles';

const FAB_SIZE = 58;

export default function BottomNavbar({
  activeItem,
  onPressPatterns,
  onPressCommunity,
  onPressTutorials,
  onPressProfile,
  onPressCamera,
}) {
  const { width } = useWindowDimensions();
  const isPatternsActive = activeItem === 'patterns';
  const isCommunityActive = activeItem === 'community';
  const isTutorialsActive = activeItem === 'tutorials';
  const isProfileActive = activeItem === 'profile';

  // 5 slots iguales: Patrones | Comunidad | [FAB centro] | Tutoriales | Perfil
  // Centro del slot 3 (índice 2) = (2 + 0.5) / 5 * width = width / 2
  const fabLeft = width / 2 - FAB_SIZE / 2;

  return (
    <View style={styles.wrapper}>

      {/* FAB elevado */}
      <TouchableOpacity
        onPress={onPressCamera}
        activeOpacity={0.85}
        style={[styles.fab, { left: fabLeft }]}
      >
        <MaterialCommunityIcons name="camera-plus" size={28} color="white" />
      </TouchableOpacity>

      {/* Barra de navegación: 5 slots */}
      <View style={styles.navBar}>

        <TouchableOpacity style={styles.navItem} onPress={onPressPatterns} activeOpacity={0.75}>
          <Ionicons name="grid-outline" size={23} color={isPatternsActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isPatternsActive && styles.navLabelActive]}>Patrones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onPressCommunity} activeOpacity={0.75}>
          <Ionicons name="people-outline" size={23} color={isCommunityActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isCommunityActive && styles.navLabelActive]}>Comunidad</Text>
        </TouchableOpacity>

        {/* Slot vacío para el FAB */}
        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.navItem} onPress={onPressTutorials} activeOpacity={0.75}>
          <Ionicons name="book-outline" size={23} color={isTutorialsActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isTutorialsActive && styles.navLabelActive]}>Tutoriales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onPressProfile} activeOpacity={0.75}>
          <Ionicons name="person-outline" size={23} color={isProfileActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isProfileActive && styles.navLabelActive]}>Mi perfil</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
