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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { registroStyles as styles } from '../styles/RegistroStyles';
import RegisterUseCase from '../../domain/usecases/RegisterUseCase';
import AuthGradientBackground from '../components/AuthGradientBackground';

export default function RegistroScreen({ navigation }) {
  const [avatarUri, setAvatarUri] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const canCreateAccount =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    acceptedTerms;

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleCreateAccount = async () => {
    setError('');
    setEmailError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const result = await RegisterUseCase.requestCode(username.trim(), email.trim(), password, confirmPassword);
      if (!result.success) {
        if (result.error?.toLowerCase().includes('correo')) {
          setEmailError(result.error);
        } else {
          setError(result.error || 'No se pudo enviar el código');
        }
        return;
      }

      navigation.navigate('VerificarCorreo', {
        mode: 'register',
        email: email.trim(),
        username: username.trim(),
        password,
        profileImageUri: avatarUri,
      });
    } catch (exception) {
      setError(exception.message);
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
            <Text style={styles.title}>Crear una cuenta</Text>
            <Text style={styles.subtitle}>
              Hola, por favor rellena el formulario para continuar
            </Text>
          </View>

          <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
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
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={[styles.inputWrapper, emailError ? { borderBottomColor: '#ff6b6b' } : null]}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  setEmailError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
            {emailError ? (
              <Text style={styles.fieldError}>
                {emailError}
              </Text>
            ) : null}

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

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(value => !value)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="rgba(255,255,255,0.55)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setAcceptedTerms(value => !value)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms && <Ionicons name="checkmark" size={13} color="white" />}
              </View>
              <Text style={styles.checkLabel}>
                Aceptar{' '}
                <Text
                  style={styles.checkLabelLink}
                  onPress={() => navigation.navigate('TermsAndConditions', { kind: 'app' })}
                >
                  términos y condiciones
                </Text>
              </Text>
            </TouchableOpacity>

            {error ? (
              <Text style={styles.formError}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, (!canCreateAccount || loading) && styles.buttonDisabled]}
              disabled={!canCreateAccount || loading}
              onPress={handleCreateAccount}
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
