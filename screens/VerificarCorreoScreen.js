// screens/VerificarCorreoScreen.js
// NUEVO — Pantalla 2 del flujo: verificación del código enviado al correo

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { verificarCorreoStyles as styles, PURPLE } from '../styles';

export default function VerificarCorreoScreen({ navigation, route }) {
  // Recibe el email de la pantalla anterior (por si se necesita para el backend)
  const { email } = route.params || {};

  // 4 inputs separados para el código de verificación
  const [codigo, setCodigo] = useState(['', '', '', '']);
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Maneja el cambio en cada casilla del código
  const handleCambioDigito = (texto, index) => {
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = texto;
    setCodigo(nuevoCodigo);
    // Auto-avanza al siguiente input si se escribió un dígito
    if (texto.length === 1 && index < 3) {
      inputs[index + 1].current.focus();
    }
  };

  const handleVerificar = () => {
    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length < 4) {
      Alert.alert('Error', 'Por favor ingresa el código completo');
      return;
    }

    // TODO: conectar con endpoint del backend para verificar el código
    // Por ahora solo navega a restablecer contraseña
    navigation.navigate('RestablecerContrasena');
  };

  const handleReenviar = () => {
    // TODO: conectar con endpoint del backend para reenviar el código
    Alert.alert('Código reenviado', `Se envió un nuevo código a ${email}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Botón Volver — regresa a la pantalla anterior del flujo */}
      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.volverText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <View style={styles.contenido}>

        {/* Título y descripción */}
        <Text style={styles.titulo}>Verificar correo{'\n'}electrónico</Text>
        <Text style={styles.descripcion}>
          Introduce el código de verificación{'\n'}enviado a tu correo.
        </Text>

        {/* 4 casillas separadas para el código */}
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

        {/* Botón verificar */}
        <TouchableOpacity style={styles.boton} onPress={handleVerificar}>
          <Text style={styles.botonText}>Verificar</Text>
        </TouchableOpacity>

        {/* Link reenviar código */}
        <TouchableOpacity onPress={handleReenviar}>
          <Text style={styles.reenviarText}>Reenviar código</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}