// screens/VerificarCorreoScreen.js
// NUEVO â€” Pantalla 2 del flujo: verificaciÃ³n del cÃ³digo enviado al correo

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { verificarCorreoStyles as styles, PURPLE } from '../styles/VerificarCorreoStyles';
import RegisterUseCase from '../../domain/usecases/RegisterUseCase';
import PasswordRecoveryUseCase from '../../domain/usecases/PasswordRecoveryUseCase';

export default function VerificarCorreoScreen({ navigation, route }) {
  const { mode = 'recovery', email, username, password } = route.params || {};

  // 4 inputs separados para el cÃ³digo de verificaciÃ³n
  const [codigo, setCodigo] = useState(['', '', '', '']);
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Maneja el cambio en cada casilla del cÃ³digo
  const handleCambioDigito = (texto, index) => {
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = texto;
    setCodigo(nuevoCodigo);
    // Auto-avanza al siguiente input si se escribiÃ³ un dÃ­gito
    if (texto.length === 1 && index < 3) {
      inputs[index + 1].current.focus();
    }
  };

  const handleVerificar = async () => {
    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length < 4) {
      Alert.alert('Error', 'Por favor ingresa el cÃ³digo completo');
      return;
    }

    if (mode === 'register') {
      const verified = await RegisterUseCase.verifyCode(email, codigoCompleto);
      if (!verified.success) {
        Alert.alert('Error', verified.error || 'No se pudo verificar el codigo');
        return;
      }

      const registered = await RegisterUseCase.complete(verified.data, username, email, password);
      if (!registered.success) {
        Alert.alert('Error', registered.error || 'No se pudo crear la cuenta');
        return;
      }

      navigation.replace('MisPatrones');
      return;
    }

    const result = await PasswordRecoveryUseCase.verifyCode(email, codigoCompleto);
    if (!result.success) {
      Alert.alert('Error', result.error || 'No se pudo verificar el codigo');
      return;
    }

    navigation.navigate('RestablecerContrasena', { verificationToken: result.data, email });
  };

  const handleReenviar = async () => {
    const result = mode === 'register'
      ? await RegisterUseCase.requestCode(username, email, password, password)
      : await PasswordRecoveryUseCase.requestCode(email);

    if (!result.success) {
      Alert.alert('Error', result.error || 'No se pudo reenviar el codigo');
      return;
    }

    Alert.alert('Codigo reenviado', `Se envio un nuevo codigo a ${email}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* BotÃ³n Volver â€” regresa a la pantalla anterior del flujo */}
      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.volverText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <View style={styles.contenido}>

        {/* TÃ­tulo y descripciÃ³n */}
        <Text style={styles.titulo}>Verificar correo{'\n'}electrÃ³nico</Text>
        <Text style={styles.descripcion}>
          Introduce el cÃ³digo de verificaciÃ³n{'\n'}enviado a tu correo.
        </Text>

        {/* 4 casillas separadas para el cÃ³digo */}
        <View style={styles.codigoContainer}>
          {codigo.map((digito, index) => (
            <TextInput
              key={index}
              ref={inputs[index]}
              style={styles.codigoCasilla}
              value={digito}
              onChangeText={texto => handleCambioDigito(texto, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {/* BotÃ³n verificar */}
        <TouchableOpacity style={styles.boton} onPress={handleVerificar}>
          <Text style={styles.botonText}>Verificar</Text>
        </TouchableOpacity>

        {/* Link reenviar cÃ³digo */}
        <TouchableOpacity onPress={handleReenviar}>
          <Text style={styles.reenviarText}>Reenviar cÃ³digo</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

