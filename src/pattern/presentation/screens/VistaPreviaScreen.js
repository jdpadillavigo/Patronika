import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vistaPreviaStyles as styles, PURPLE } from '../styles/VistaPreviaStyles';

export default function VistaPreviaScreen({ navigation, route }) {
  const { patronUrl, imageUri, nombre } = route?.params || {};
  const previewUri = patronUrl || imageUri;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vista previa</Text>
        <TouchableOpacity onPress={() => navigation.popTo('GenerarPatron')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.patternContainer}>
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={styles.patternImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.patternPlaceholder}>
              <ActivityIndicator size="large" color={PURPLE} />
              <Text style={styles.placeholderText}>Generando patrÃ³n...</Text>
            </View>
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.buttonSolid}
            onPress={() => navigation.popTo('GenerarPatron')}
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

