// screens/OlvidasteContrasenaScreen.js
// NUEVO — Pantalla 1 del flujo de recuperación de contraseña

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { olvidasteStyles as styles, PURPLE } from '../styles';

export default function OlvidasteContrasenaScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleEnviar = () => {
    // Validación básica del email
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    // TODO: conectar con endpoint del backend para enviar el correo
    // Por ahora solo navega a la pantalla de verificación
    navigation.navigate('VerificarCorreo', { email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Botón Volver — regresa al Login (no a la pantalla anterior del stack) */}
      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.volverText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <View style={styles.contenido}>

        {/* Título y descripción */}
        <Text style={styles.titulo}>¿Olvidaste tu{'\n'}contraseña?</Text>
        <Text style={styles.descripcion}>
          Ingrese su dirección de correo electrónico a continuación y le
          enviaremos un correo con instrucciones sobre cómo cambiar su contraseña.
        </Text>

        {/* Campo email con solo línea inferior */}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Botón enviar */}
        <TouchableOpacity style={styles.boton} onPress={handleEnviar}>
          <Text style={styles.botonText}>Enviar</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}