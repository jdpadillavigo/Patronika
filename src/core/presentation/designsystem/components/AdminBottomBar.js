import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminBottomNavigationItem } from '../../../domain/BottomNavigationItem';
import { PURPLE, bottomNavigationStyles as styles } from './BottomNavigationStyles';

export default function AdminBottomBar({
  activeItem,         
  onPressUsers,        
  onPressCommunity,     
  onPressProfile,       
}) {
  const isUsersActive = activeItem === AdminBottomNavigationItem.USERS;
  const isCommunityActive = activeItem === AdminBottomNavigationItem.COMMUNITY_MANAGEMENT;
  const isProfileActive = activeItem === AdminBottomNavigationItem.PROFILE;
 
  return (
    <View style={styles.wrapper}>
      {/* Barra de navegación: 3 slots de igual flex, sin FAB central */}
      <View style={[styles.navBar, styles.adminNavBar]}>
 
        <TouchableOpacity style={styles.navItem} onPress={onPressUsers} activeOpacity={0.75}>
          <Ionicons name={isUsersActive ? 'people' : 'people-outline'} size={23} color={isUsersActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isUsersActive && styles.navLabelActive]}>Gestión de Usuarios</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.navItem} onPress={onPressCommunity} activeOpacity={0.75}>
          <Ionicons name={isCommunityActive ? 'home' : 'home-outline'} size={23} color={isCommunityActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isCommunityActive && styles.navLabelActive]}>Gestión de Comunidad</Text>
        </TouchableOpacity>
 
        <TouchableOpacity style={styles.navItem} onPress={onPressProfile} activeOpacity={0.75}>
          <Ionicons name={isProfileActive ? 'person' : 'person-outline'} size={23} color={isProfileActive ? PURPLE : '#AAA'} />
          <Text style={[styles.navLabel, isProfileActive && styles.navLabelActive]}>Mi perfil</Text>
        </TouchableOpacity>
 
      </View>
    </View>
  );
}
