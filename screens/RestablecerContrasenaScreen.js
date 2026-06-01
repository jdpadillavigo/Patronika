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
import { restablecerStyles as styles, PURPLE } from '../styles';

export default function RestablecerContrasenaScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRestablecer = () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa una contraseÃ±a');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseÃ±a debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmar) {
      Alert.alert('Error', 'Las contraseÃ±as no coinciden');
      return;
    }

    // TODO: conectar con endpoint del backend para actualizar la contraseÃ±a
    // Por ahora muestra el modal de confirmaciÃ³n
    setModalVisible(true);
  };

  const handleIrALogin = () => {
    setModalVisible(false);
    // Limpia el stack de navegaciÃ³n y va directo al Login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* BotÃ³n Volver â€” regresa a la pantalla anterior del flujo */}
      <TouchableOpacity
        style={styles.volverBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.volverText}>{'< Volver'}</Text>
      </TouchableOpacity>

      <View style={styles.contenido}>

        {/* TÃ­tulo y descripciÃ³n */}
        <Text style={styles.titulo}>Restablecer{'\n'}contraseÃ±a</Text>
        <Text style={styles.descripcion}>Ingrese su nueva contraseÃ±a.</Text>

        {/* Campo contraseÃ±a nueva */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ContraseÃ±a"
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

        {/* Campo confirmar contraseÃ±a */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Repetir contraseÃ±a"
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

        {/* BotÃ³n restablecer */}
        <TouchableOpacity style={styles.boton} onPress={handleRestablecer}>
          <Text style={styles.botonText}>Restablecer</Text>
        </TouchableOpacity>

      </View>

      {/* Modal de confirmaciÃ³n â€” se muestra al restablecer con Ã©xito */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            {/* Ãcono candado con flecha */}
            <View style={styles.modalIconContainer}>
              <Ionicons name="lock-closed-outline" size={36} color={PURPLE} />
              <View style={styles.modalIconBadge}>
                <Ionicons name="refresh-outline" size={14} color={PURPLE} />
              </View>
            </View>

            <Text style={styles.modalTitulo}>Â¡ContraseÃ±a{'\n'}restablecida!</Text>

            {/* BotÃ³n para ir al login */}
            <TouchableOpacity style={styles.modalBoton} onPress={handleIrALogin}>
              <Text style={styles.modalBotonText}>Iniciar sesiÃ³n</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
