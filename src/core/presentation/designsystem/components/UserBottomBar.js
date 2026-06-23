
import React from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserBottomNavigationItem } from '../../../domain/BottomNavigationItem';
import { PURPLE, bottomNavigationStyles as styles } from './BottomNavigationStyles';

const FAB_SIZE = 58;

export default function UserBottomBar({
  activeItem,       
  onPressPatterns,   // navega a MisPatrones
  onPressCommunity,  // navega a Comunidad
  onPressProfile,    // navega a Perfil
  onPressCamera,     // navega a GenerarPatron (acción central del app)
}) {
  const { width } = useWindowDimensions();
  const isPatternsActive = activeItem === UserBottomNavigationItem.PATTERNS;
  const isCommunityActive = activeItem === UserBottomNavigationItem.COMMUNITY;
  const isProfileActive = activeItem === UserBottomNavigationItem.PROFILE;

  // Centro del 3er slot en un layout de 4 slots iguales = 5/8 del ancho total
  const fabLeft = (width * 5) / 8 - FAB_SIZE / 2;

  return (
    <View style={styles.wrapper}>

      {/* FAB elevado — posicionado absolutamente sobre el 3er slot */}
      <TouchableOpacity
        onPress={onPressCamera}
        activeOpacity={0.85}
        style={[styles.fab, { left: fabLeft }]}
      >
        <MaterialCommunityIcons name="camera-plus" size={28} color="white" />
      </TouchableOpacity>

      {/* Barra de navegación: 4 slots de igual flex */}
      <View style={styles.navBar}>

        <TouchableOpacity style={styles.navItem} onPress={onPressPatterns} activeOpacity={0.75}>
          <Ionicons name="grid-outline" size={23} color={isPatternsActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isPatternsActive && styles.navLabelActive]}>Patrones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onPressCommunity} activeOpacity={0.75}>
          <Ionicons name="people-outline" size={23} color={isCommunityActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isCommunityActive && styles.navLabelActive]}>Comunidad</Text>
        </TouchableOpacity>

        {/* Slot vacío del mismo tamaño que los otros — el FAB flota encima */}
        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.navItem} onPress={onPressProfile} activeOpacity={0.75}>
          <Ionicons name="person-outline" size={23} color={isProfileActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isProfileActive && styles.navLabelActive]}>Mi perfil</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
