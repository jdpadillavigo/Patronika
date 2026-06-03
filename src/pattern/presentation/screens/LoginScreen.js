import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loginStyles as styles } from '../styles/LoginStyles';
import LoginUseCase from '../../domain/usecases/LoginUseCase';
import AuthGradientBackground from '../components/AuthGradientBackground';
import { useErrorPopup } from '../components/ErrorPopup';

export default function LoginScreen({ navigation }) {
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
      navigation.replace('MisPatrones');
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0B08" />

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
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(value => !value)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="rgba(255,255,255,0.55)"
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
    </SafeAreaView>
  );
}
