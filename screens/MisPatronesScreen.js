import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { misPatronesStyles as styles, PURPLE } from '../styles';

export default function MisPatronesScreen({ navigation }) {
  const [navActiva, setNavActiva] = useState('patrones');

  const patrones = [];

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patrónika</Text>
      </View>

      {/* ── CONTENIDO ────────────────────────────────────────────────── */}
      <View style={styles.contenido}>
        {navActiva === 'patrones' ? (
          patrones.length === 0 ? (
            <View style={styles.vacio}>
              <Text style={styles.vacioText}>No creaste patrones aún</Text>
            </View>
          ) : (
            <FlatList
              data={patrones}
              keyExtractor={item => item.id.toString()}
              numColumns={1}
              contentContainerStyle={styles.listaPatrones}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cardPatron}>
                  <View style={styles.cardImagen} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardNombre} numberOfLines={1}>{item.nombre}</Text>
                    <Text style={styles.cardCreador} numberOfLines={1}>Creador: {item.creador}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardValoracion}>Sin valoraciones</Text>
                      <Text style={styles.cardDificultad}>Dificultad: {item.dificultad}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )
        ) : (
          <View style={styles.vacio}>
            <Text style={styles.vacioText}>Próximamente</Text>
          </View>
        )}
      </View>

      {/* ── BARRA DE NAVEGACIÓN INFERIOR ─────────────────────────────── */}
      <View style={styles.navBar}>

        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setNavActiva('patrones')}
          >
            <Ionicons name="grid-outline" size={24} color={navActiva === 'patrones' ? PURPLE : '#AAA'} />
            <Text style={[styles.navLabel, navActiva === 'patrones' && styles.navLabelActivo]}>
              Patrones
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navCenter} />

        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Ionicons name="person-outline" size={24} color="#AAA" />
            <Text style={styles.navLabel}>Mi perfil</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={handleFab}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="camera-plus" size={30} color="white" />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
