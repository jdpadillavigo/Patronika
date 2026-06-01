// screens/OlvidasteContrasenaScreen.js
// NUEVO â€” Pantalla 1 del flujo de recuperaciÃ³n de contraseÃ±a

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
import { olvidasteStyles as styles, PURPLE } from '../styles/OlvidasteContrasenaStyles';
import PasswordRecoveryUseCase from '../../domain/usecases/PasswordRecoveryUseCase';

export default function OlvidasteContrasenaScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleEnviar = async () => {
    const result = await PasswordRecoveryUseCase.requestCode(email);
    if (!result.success) {
      Alert.alert('Error', result.error || 'No se pudo enviar el codigo');
      return;
    }
    navigation.navigate('VerificarCorreo', { mode: 'recovery', email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* BotÃ³n Volver â€” regresa al Login (no a la pantalla anterior del stack) */}
      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.volverText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <View style={styles.contenido}>

        {/* TÃ­tulo y descripciÃ³n */}
        <Text style={styles.titulo}>Â¿Olvidaste tu{'\n'}contraseÃ±a?</Text>
        <Text style={styles.descripcion}>
          Ingrese su direcciÃ³n de correo electrÃ³nico a continuaciÃ³n y le
          enviaremos un correo con instrucciones sobre cÃ³mo cambiar su contraseÃ±a.
        </Text>

        {/* Campo email con solo lÃ­nea inferior */}
        <TextInput
          style={styles.input}
          placeholder="Correo electrÃ³nico"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* BotÃ³n enviar */}
        <TouchableOpacity style={styles.boton} onPress={handleEnviar}>
          <Text style={styles.botonText}>Enviar</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

