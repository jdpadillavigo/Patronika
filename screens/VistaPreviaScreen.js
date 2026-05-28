import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#7B3F7E';

export default function VistaPreviaScreen({ navigation, route }) {
  // patronUrl vendrá del backend cuando esté conectado
  const { patronUrl, nombre } = route?.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vista previa</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Imagen del patrón generado */}
        <View style={styles.patternContainer}>
          {patronUrl ? (
            <Image
              source={{ uri: patronUrl }}
              style={styles.patternImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.patternPlaceholder}>
              <ActivityIndicator size="large" color={PURPLE} />
              <Text style={styles.placeholderText}>Generando patrón...</Text>
            </View>
          )}
        </View>

        {/* Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.buttonSolid}
            onPress={() => {
              // TODO: llamar al backend para guardar
              navigation.popToTop();
            }}
          >
            <Text style={styles.buttonSolidText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonOutlineText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PURPLE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 40,
  },
  patternContainer: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PURPLE,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  patternPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  placeholderText: {
    color: PURPLE,
    fontSize: 14,
  },
  buttons: {
    width: '100%',
    gap: 14,
  },
  buttonSolid: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonSolidText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
