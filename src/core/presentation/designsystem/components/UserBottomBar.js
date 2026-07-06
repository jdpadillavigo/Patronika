import React, { useMemo } from 'react';
import Colors from '../Colors';
import { useAppTheme } from '../Theme';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserBottomNavigationItem } from '../../../domain/BottomNavigationItem';
import { PURPLE, createBottomNavigationStyles, bottomNavigationStyles as styles } from './BottomNavigationStyles';

const FAB_SIZE = 58;

export default function UserBottomBar({activeItem,
  onPressPatterns,   // navega a MisPatrones
  onPressCommunity,  // navega a Comunidad
  onPressTutorials,  // navega a Tutoriales
  onPressProfile,    // navega a Perfil
  onPressCamera,     // navega a GenerarPatron (acción central del app)
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createBottomNavigationStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const isPatternsActive = activeItem === UserBottomNavigationItem.PATTERNS;
  const isCommunityActive = activeItem === UserBottomNavigationItem.COMMUNITY;
  const isTutorialsActive = activeItem === UserBottomNavigationItem.TUTORIALS;
  const isProfileActive = activeItem === UserBottomNavigationItem.PROFILE;

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
        <MaterialCommunityIcons name="camera-plus" size={28} color={Colors.fixedWhite} />
      </TouchableOpacity>

      {/* Barra de navegación: 5 slots */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={onPressPatterns} activeOpacity={0.75}>
          <Ionicons name={isPatternsActive ? 'grid' : 'grid-outline'} size={23} color={isPatternsActive ? PURPLE : colors.iconMuted} />
          <Text style={[styles.navLabel, isPatternsActive && styles.navLabelActive]}>Patrones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onPressCommunity} activeOpacity={0.75}>
          <Ionicons name={isCommunityActive ? 'people' : 'people-outline'} size={23} color={isCommunityActive ? PURPLE : colors.iconMuted} />
          <Text style={[styles.navLabel, isCommunityActive && styles.navLabelActive]}>Comunidad</Text>
        </TouchableOpacity>

        {/* Slot vacío para el FAB */}
        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.navItem} onPress={onPressTutorials} activeOpacity={0.75}>
          <Ionicons name={isTutorialsActive ? 'book' : 'book-outline'} size={23} color={isTutorialsActive ? PURPLE : colors.iconMuted} />
          <Text style={[styles.navLabel, isTutorialsActive && styles.navLabelActive]}>Tutoriales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onPressProfile} activeOpacity={0.75}>
          <Ionicons name={isProfileActive ? 'person' : 'person-outline'} size={23} color={isProfileActive ? PURPLE : colors.iconMuted} />
          <Text style={[styles.navLabel, isProfileActive && styles.navLabelActive]}>Mi perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
