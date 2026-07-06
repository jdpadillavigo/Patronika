import React, { useState, useMemo } from 'react';
import Colors from '../../../../../core/presentation/designsystem/Colors';
import { useAppTheme } from '../../../../../core/presentation/designsystem/Theme';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createLoginStyles, loginStyles as styles } from '../styles/LoginStyles';
import LoginUseCase from '../../domain/usecases/LoginUseCase';
import AuthGradientBackground from '../../../../../core/presentation/designsystem/components/AuthGradientBackground';
import { useErrorPopup } from '../../../../../core/presentation/designsystem/components/ErrorPopup';

export default function LoginScreen({navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createLoginStyles(colors), [colors]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showError, errorPopup } = useErrorPopup();

  const canLogin = username.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await LoginUseCase.execute(username.trim(), password);
      if (!result.success) {
        showError(result.error || 'No se pudo iniciar sesión');
        return;
      }
      if (result.data?.isAdmin) {
        navigation.replace('GestionUsuarios');
      } else {
        navigation.replace('MisPatrones');
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>

      <AuthGradientBackground />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor={Colors.whiteAlpha45}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={40}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={Colors.whiteAlpha45}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                maxLength={80}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(value => !value)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={Colors.whiteAlpha55}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, (!canLogin || loading) && styles.buttonDisabled]}
              disabled={!canLogin || loading}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Ingresando...' : 'INICIAR SESIÓN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkCenter} onPress={() => navigation.navigate('OlvidasteContrasena')}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.bottomText}>¿Aún no tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.bottomLink}>Regístrate ahora</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {errorPopup}
    </View>
  );
}
