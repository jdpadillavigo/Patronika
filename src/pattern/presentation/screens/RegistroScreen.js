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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { registroStyles as styles, AUTH_GRADIENTS, absoluteFill } from '../styles/RegistroStyles';
import RegisterUseCase from '../../domain/usecases/RegisterUseCase';

export default function RegistroScreen({ navigation }) {
  const [avatar, setAvatar] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');

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

  const puedeCrear =
    usuario.trim().length > 0 &&
    correo.trim().length > 0 &&
    contrasena.length > 0 &&
    confirmar.length > 0 &&
    aceptaTerminos;

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const handleCrearCuenta = async () => {
    setError('');
    setErrorCorreo('');
    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const result = await RegisterUseCase.requestCode(usuario.trim(), correo.trim(), contrasena, confirmar);
      if (!result.success) {
        if (result.error?.toLowerCase().includes('correo')) {
          setErrorCorreo(result.error);
        } else {
          setError(result.error || 'No se pudo enviar el código');
        }
        return;
      }
      navigation.navigate('VerificarCorreo', {
        mode: 'register',
        email: correo.trim(),
        username: usuario.trim(),
        password: contrasena,
        profileImageUri: avatar,
      });
    } catch (e) {
      setError(e.message);
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
            <Text style={styles.title}>Crear una cuenta</Text>
            <Text style={styles.subtitle}>
              Hola, por favor rellena el formulario para continuar
            </Text>
          </View>

          <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={52} color="#888" />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Ionicons name="add" size={16} color="white" />
            </View>
          </TouchableOpacity>

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

            <View style={[styles.inputWrapper, errorCorreo ? { borderBottomColor: '#ff6b6b' } : null]}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={correo}
                onChangeText={v => { setCorreo(v); setErrorCorreo(''); }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
            {errorCorreo ? (
              <Text style={{ color: '#ff6b6b', fontSize: 13, marginTop: -14 }}>
                {errorCorreo}
              </Text>
            ) : null}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!mostrarPass}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setMostrarPass(v => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={mostrarPass ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="rgba(255,255,255,0.55)"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={confirmar}
                onChangeText={setConfirmar}
                secureTextEntry={!mostrarConfirmar}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setMostrarConfirmar(v => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={mostrarConfirmar ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="rgba(255,255,255,0.55)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setAceptaTerminos(v => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, aceptaTerminos && styles.checkboxChecked]}>
                {aceptaTerminos && <Ionicons name="checkmark" size={13} color="white" />}
              </View>
              <Text style={styles.checkLabel}>
                Aceptar <Text style={styles.checkLabelLink}>términos y condiciones</Text>
              </Text>
            </TouchableOpacity>

            {error ? (
              <Text style={{ color: '#ff6b6b', fontSize: 13, textAlign: 'center', marginTop: -8 }}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, (!puedeCrear || loading) && styles.buttonDisabled]}
              disabled={!puedeCrear || loading}
              onPress={handleCrearCuenta}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.bottomText}>¿Ya estás registrado? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.bottomLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

