import React, { useState, useMemo } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useAppTheme } from '../../../ui/theme/Theme';
import { createRegisterStyles } from '../styles/RegisterStyles';
import RegisterUseCase from '../../domain/usecases/RegisterUseCase';

export default function RegisterScreen({ navigation }) {
    const { colors } = useAppTheme();
    const styles = useMemo(() => createRegisterStyles(colors), [colors]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const getPasswordStrength = () => {
        if (password.length === 0) return { label: '', color: colors.inputBorder, width: '0%' };
        if (password.length < 6) return { label: 'Débil', color: colors.error, width: '25%' };
        if (password.length < 8) return { label: 'Regular', color: colors.warning, width: '50%' };
        if (password.length < 10) return { label: 'Buena', color: colors.info, width: '75%' };
        return { label: 'Fuerte', color: colors.success, width: '100%' };
    };

    const handleRegister = async () => {
        setLoading(true);

        try {
            const result = await RegisterUseCase.execute(username, email, password, confirmPassword);

            if (result.success) {
                Alert.alert(
                    '¡Cuenta creada!',
                    `Bienvenido ${username}.\nTu cuenta ha sido creada exitosamente.`,
                    [{ text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }]
                );
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error inesperado. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>

                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Completa el formulario para registrarte</Text>
                </View>

                <View style={styles.formContainer}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre de usuario</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="juanperez"
                            placeholderTextColor={colors.textSecondary}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@correo.com"
                            placeholderTextColor={colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!passwordVisible}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.eyeButton} onPress={() => setPasswordVisible(!passwordVisible)}>
                                <Text style={styles.eyeIcon}>{passwordVisible ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                        {password.length > 0 && (
                            <View style={styles.strengthContainer}>
                                <View style={styles.strengthBar}>
                                    <View style={[styles.strengthFill, { width: strength.width, backgroundColor: strength.color }]} />
                                </View>
                                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirmar contraseña</Text>
                        <TextInput
                            style={[
                                styles.input,
                                confirmPassword.length > 0 && password !== confirmPassword ? styles.inputError : null,
                            ]}
                            placeholder="Repite tu contraseña"
                            placeholderTextColor={colors.textSecondary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!passwordVisible}
                            autoCapitalize="none"
                        />
                        {confirmPassword.length > 0 && password !== confirmPassword && (
                            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.registerButtonText}>{loading ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
