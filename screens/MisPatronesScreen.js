// screens/MisPatronesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { misPatronesStyles as styles, PURPLE } from '../styles';

const TABS = ['Comunidad', 'Mis patrones'];

export default function MisPatronesScreen({ navigation }) {
  const [tabActiva, setTabActiva] = useState('Mis patrones');
  const [navActiva, setNavActiva] = useState('patrones');

  const patrones = [];

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patrónika</Text>
      </View>

      {/* ── TABS ─────────────────────────────────────────────────────── */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setTabActiva(tab)}
          >
            <Text style={[styles.tabText, tabActiva === tab && styles.tabTextActivo]}>
              {tab}
            </Text>
            {tabActiva === tab && <View style={styles.tabIndicador} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── CONTENIDO ────────────────────────────────────────────────── */}
      <View style={styles.contenido}>
        {tabActiva === 'Mis patrones' ? (
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
                  {/* CAMBIO: texto del card ahora dentro del recuadro morado en blanco */}
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
            <Text style={styles.vacioText}>Próximamente: patrones de la comunidad</Text>
          </View>
        )}
      </View>

      {/* ── BARRA DE NAVEGACIÓN INFERIOR ─────────────────────────────── */}
      {/*
        CAMBIO: nuevo layout de la navBar.
        Estructura: [Patrones] [Tutoriales] [FAB CENTRO] [Mi perfil]
        El FAB está posicionado en absolute para que quede exactamente centrado
        sin depender del flex de los otros ítems.
      */}
      <View style={styles.navBar}>

        {/* Lado izquierdo: Patrones + Tutoriales */}
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

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setNavActiva('tutoriales')}
          >
            <Ionicons name="school-outline" size={24} color={navActiva === 'tutoriales' ? PURPLE : '#AAA'} />
            <Text style={[styles.navLabel, navActiva === 'tutoriales' && styles.navLabelActivo]}>
              Tutoriales
            </Text>
          </TouchableOpacity>
        </View>

        {/* CAMBIO: espacio central vacío donde "entra" el FAB visualmente */}
        <View style={styles.navCenter} />

        {/* Lado derecho: Mi perfil solo */}
        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setNavActiva('perfil')}
          >
            <Ionicons name="person-outline" size={24} color={navActiva === 'perfil' ? PURPLE : '#AAA'} />
            <Text style={[styles.navLabel, navActiva === 'perfil' && styles.navLabelActivo]}>
              Mi perfil
            </Text>
          </TouchableOpacity>
        </View>

        {/* CAMBIO: FAB en absolute para que quede exactamente centrado en la navBar */}
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