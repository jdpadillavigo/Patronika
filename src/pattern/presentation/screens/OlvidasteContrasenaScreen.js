import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { olvidasteStyles as styles } from '../styles/OlvidasteContrasenaStyles';
import PasswordRecoveryUseCase from '../../domain/usecases/PasswordRecoveryUseCase';
import { useErrorPopup } from '../components/ErrorPopup';

export default function OlvidasteContrasenaScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { showError, errorPopup } = useErrorPopup();

  const handleEnviar = async () => {
    const result = await PasswordRecoveryUseCase.requestCode(email);
    if (!result.success) {
      showError(result.error || 'No se pudo enviar el código');
      return;
    }
    navigation.navigate('VerificarCorreo', { mode: 'recovery', email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.volverText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <View style={styles.contenido}>

        <Text style={styles.titulo}>¿Olvidaste tu{'\n'}contraseña?</Text>
        <Text style={styles.descripcion}>
          Ingrese su dirección de correo electrónico a continuación y le
          enviaremos un correo con instrucciones sobre cómo cambiar su contraseña.
        </Text>

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

        <TouchableOpacity style={styles.boton} onPress={handleEnviar}>
          <Text style={styles.botonText}>Enviar</Text>
        </TouchableOpacity>

      </View>
      {errorPopup}
    </SafeAreaView>
  );
}

