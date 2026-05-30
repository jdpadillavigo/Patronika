import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formularioStyles as styles, PURPLE } from '../styles';

const API_BASE_URL = 'http://TU_IP:TU_PUERTO';
const USER_ID = '1';

function NumericStepper({ valor, onChange }) {
  const decrement = () => { if (valor > 1) onChange(valor - 1); };
  const increment = () => { if (valor < 100) onChange(valor + 1); };

  const handleText = (text) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 1 && num <= 100) onChange(num);
    else if (text === '') onChange('');
  };

  return (
    <View style={styles.stepper}>
      <TouchableOpacity style={styles.stepperBtn} onPress={decrement} disabled={valor <= 1}>
        <Text style={[styles.stepperSymbol, valor <= 1 && styles.stepperDisabled]}>−</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.stepperInput}
        value={String(valor)}
        onChangeText={handleText}
        keyboardType="numeric"
        maxLength={3}
        textAlign="center"
      />
      <TouchableOpacity style={styles.stepperBtn} onPress={increment} disabled={valor >= 100}>
        <Text style={[styles.stepperSymbol, valor >= 100 && styles.stepperDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FormularioPatronScreen({ navigation, route }) {
  const { imageUri } = route?.params || {};
  const [nombre, setNombre] = useState('');
  const [tamano, setTamano] = useState(50);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const puedeGenerar = nombre.trim().length > 0 && tamano >= 1 && tamano <= 100;

  const handleGenerar = () => {
    navigation.navigate('VistaPrevia', { imageUri, nombre, tamano });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generar patrón</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de patrón"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Tamaño (1 – 100)</Text>
            <TouchableOpacity onPress={() => setShowInfoModal(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="information-circle-outline" size={22} color={PURPLE} />
            </TouchableOpacity>
          </View>
          <NumericStepper valor={tamano} onChange={setTamano} />
        </View>

        <TouchableOpacity
          style={[styles.button, !puedeGenerar && styles.buttonDisabled]}
          disabled={!puedeGenerar}
          onPress={handleGenerar}
        >
          <Text style={styles.buttonText}>Generar</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={showInfoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="information-circle" size={48} color={PURPLE} />
            <Text style={styles.modalTitle}>¿Qué tamaño elegir?</Text>

            <View style={styles.infoRow}>
              <Ionicons name="image-outline" size={20} color={PURPLE} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Imagen pequeña o simple</Text>
                <Text style={styles.infoDesc}>Pocos colores o diseño sencillo → tamaño 10 – 30</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="image" size={20} color={PURPLE} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Imagen mediana</Text>
                <Text style={styles.infoDesc}>Detalle moderado → tamaño 30 – 50</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="images" size={20} color={PURPLE} />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Imagen grande o detallada</Text>
                <Text style={styles.infoDesc}>Muchos colores o alta resolución → tamaño 40 – 60 para que el patrón salga bien</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowInfoModal(false)}>
              <Text style={styles.modalBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
