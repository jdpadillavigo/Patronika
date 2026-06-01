import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { restablecerStyles as styles, PURPLE } from '../styles/RestablecerContrasenaStyles';
import PasswordRecoveryUseCase from '../../domain/usecases/PasswordRecoveryUseCase';

export default function RestablecerContrasenaScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRestablecer = async () => {
    const result = await PasswordRecoveryUseCase.resetPassword(password, confirmar);
    if (!result.success) {
      Alert.alert('Endpoint pendiente', result.error || 'No se pudo restablecer la contrasena');
      return;
    }
    setModalVisible(true);
  };
 
  const handleIrALogin = () => {
    setModalVisible(false);
    // Limpia el stack de navegación y va directo al Login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
        <Text style={styles.titulo}>Restablecer{'\n'}contraseña</Text>
        <Text style={styles.descripcion}>Ingrese su nueva contraseña.</Text>
 
        {/* Campo contraseña nueva */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#BDBDBD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!verPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
            <Ionicons
              name={verPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#BDBDBD"
            />
          </TouchableOpacity>
        </View>
 
        {/* Campo confirmar contraseña */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repetir contraseña"
            placeholderTextColor="#BDBDBD"
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry={!verConfirmar}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)}>
            <Ionicons
              name={verConfirmar ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#BDBDBD"
            />
          </TouchableOpacity>
        </View>
 
        {/* Botón restablecer */}
        <TouchableOpacity style={styles.boton} onPress={handleRestablecer}>
          <Text style={styles.botonText}>Restablecer</Text>
        </TouchableOpacity>
 
      </View>
 
      {/* Modal de confirmación — se muestra al restablecer con éxito */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
 
            {/* Ícono candado con flecha */}
            <View style={styles.modalIconContainer}>
              <Ionicons name="lock-closed-outline" size={36} color={PURPLE} />
              <View style={styles.modalIconBadge}>
                <Ionicons name="refresh-outline" size={14} color={PURPLE} />
              </View>
            </View>
 
            <Text style={styles.modalTitulo}>¡Contraseña{'\n'}restablecida!</Text>
 
            {/* Botón para ir al login */}
            <TouchableOpacity style={styles.modalBoton} onPress={handleIrALogin}>
              <Text style={styles.modalBotonText}>Iniciar sesión</Text>
            </TouchableOpacity>
 
          </View>
        </View>
      </Modal>
 
    </SafeAreaView>
  );
}
