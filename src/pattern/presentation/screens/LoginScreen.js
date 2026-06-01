import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { loginStyles as styles, PURPLE, AUTH_GRADIENTS, absoluteFill } from '../styles/LoginStyles';
import LoginUseCase from '../../domain/usecases/LoginUseCase';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const cycle = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0);
        setCurrentIndex(c => (c + 1) % AUTH_GRADIENTS.length);
        setNextIndex(n => (n + 1) % AUTH_GRADIENTS.length);
      });
    };
    const timer = setInterval(cycle, 4500);
    return () => clearInterval(timer);
  }, []);

  const puedeIngresar = usuario.trim().length > 0 && contrasena.length > 0;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await LoginUseCase.execute(usuario.trim(), contrasena);
      if (!result.success) {
        Alert.alert('Error', result.error || 'No se pudo iniciar sesion');
        return;
      }
      navigation.replace('MisPatrones');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0B08" />

      <View style={absoluteFill}>
        <LinearGradient colors={AUTH_GRADIENTS[currentIndex]} style={absoluteFill} />
        <Animated.View style={[absoluteFill, { opacity: fadeAnim }]}>
          <LinearGradient colors={AUTH_GRADIENTS[nextIndex]} style={absoluteFill} />
        </Animated.View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <View style={styles.titleGroup}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesiÃ³n para continuar</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="ContraseÃ±a"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!mostrarContrasena}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setMostrarContrasena(v => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={mostrarContrasena ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="rgba(255,255,255,0.55)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, (!puedeIngresar || loading) && styles.buttonDisabled]}
              disabled={!puedeIngresar || loading}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Ingresando...' : 'INICIAR SESIÃ“N'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkCenter} onPress={() => navigation.navigate('OlvidasteContrasena')}>
              <Text style={styles.linkText}>Â¿Olvidaste tu contraseÃ±a?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Â¿AÃºn no tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.bottomLink}>RegÃ­strate ahora</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

