import React from 'react';
import { Text, View } from 'react-native';

import { AdminBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import AdminBottomBar from '../../../../core/presentation/designsystem/components/AdminBottomBar';
import { adminCommunityManagementStyles as styles } from '../styles/AdminCommunityManagementStyles';

export default function AdminCommunityManagementScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Pantalla de Gestión de Comunidad</Text>
      </View>

      <AdminBottomBar
        activeItem={AdminBottomNavigationItem.COMMUNITY_MANAGEMENT}
        onPressUsers={() => navigation.navigate('GestionUsuarios')}
        onPressCommunity={() => undefined}
        onPressProfile={() => navigation.navigate('Perfil')}
      />
    </View>
  );
}
