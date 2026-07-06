import React, { useState, useMemo } from 'react';
import { useAppTheme } from '../../../../core/presentation/designsystem/Theme';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { createOlvidasteStyles, olvidasteStyles as styles } from '../styles/ForgotPasswordStyles';
import PasswordRecoveryUseCase from '../../domain/usecases/PasswordRecoveryUseCase';
import BackButton from '../../../../core/presentation/designsystem/components/BackButton';
import { useErrorPopup } from '../../../../core/presentation/designsystem/components/ErrorPopup';

export default function OlvidasteContrasenaScreen({navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createOlvidasteStyles(colors), [colors]);
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
    <View style={styles.safeArea}>

      <BackButton onPress={() => navigation.navigate('Login')} />

      <View style={styles.contenido}>

        <Text style={styles.titulo}>¿Olvidaste tu{'\n'}contraseña?</Text>
        <Text style={styles.descripcion}>
          Ingrese su dirección de correo electrónico a continuación y le
          enviaremos un correo con instrucciones sobre cómo cambiar su contraseña.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.inputUnderline}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={80}
        />

        <TouchableOpacity style={styles.boton} onPress={handleEnviar}>
          <Text style={styles.botonText}>Enviar</Text>
        </TouchableOpacity>

      </View>
      {errorPopup}
    </View>
  );
}

