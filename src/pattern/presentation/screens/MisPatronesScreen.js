import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { misPatronesStyles as styles, PURPLE } from '../styles/MisPatronesStyles';
import PatternUseCase from '../../domain/usecases/PatternUseCase';

export default function MisPatronesScreen({ navigation }) {
  const [navActiva, setNavActiva] = useState('patrones');
  const [patrones, setPatrones] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPatterns = useCallback(async () => {
    setLoading(true);
    const result = await PatternUseCase.listMine();
    if (result.success) {
      setPatrones(result.data || []);
    } else {
      Alert.alert('Error', result.error || 'No se pudieron cargar tus patrones');
    }
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadPatterns();
  }, [loadPatterns]));

  const handleFab = () => {
    navigation.navigate('GenerarPatron');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patronika</Text>
      </View>

      <View style={styles.contenido}>
        {loading ? (
          <View style={styles.vacio}>
            <ActivityIndicator size="large" color={PURPLE} />
          </View>
        ) : navActiva === 'patrones' ? (
          patrones.length === 0 ? (
            <View style={styles.vacio}>
              <Text style={styles.vacioText}>No creaste patrones aun</Text>
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
                    <Text style={styles.cardNombre} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cardCreador} numberOfLines={1}>Creador: {item.user?.username || 'Tu'}</Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardValoracion}>Sin valoraciones</Text>
                      <Text style={styles.cardDificultad}>Tamano: {item.size}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )
        ) : (
          <View style={styles.vacio}>
            <Text style={styles.vacioText}>Proximamente</Text>
          </View>
        )}
      </View>

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

