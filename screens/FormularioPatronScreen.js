import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#7B3F7E';

const OPCIONES_TAMANO = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const OPCIONES_TECNICA = ['Crochet', 'Dos agujas', 'Telar', 'Bordado'];

function DropdownField({ label, opciones, valor, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={[styles.dropdownText, !valor && styles.placeholder]}>
          {valor || 'Selecciona una opción'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#888" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={opciones}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, item === valor && styles.selectedItem]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function FormularioPatronScreen({ navigation, route }) {
  const { imageUri } = route?.params || {};
  const [nombre, setNombre] = useState('');
  const [tamano, setTamano] = useState('');
  const [tecnica, setTecnica] = useState('');

  const puedeGenerar = nombre.trim().length > 0 && tamano && tecnica;

  const handleGenerar = () => {
    // Por ahora solo navega a Vista Previa sin llamar al backend
    navigation.navigate('VistaPrevia', { imageUri, nombre, tamano, tecnica });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generar patrón</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Nombre */}
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

        <DropdownField
          label="Tamaño"
          opciones={OPCIONES_TAMANO}
          valor={tamano}
          onChange={setTamano}
        />

        <DropdownField
          label="Técnica de tejido"
          opciones={OPCIONES_TECNICA}
          valor={tecnica}
          onChange={setTecnica}
        />

        <TouchableOpacity
          style={[styles.button, !puedeGenerar && styles.buttonDisabled]}
          disabled={!puedeGenerar}
          onPress={handleGenerar}
        >
          <Text style={styles.buttonText}>Generar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PURPLE,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
  },
  dropdown: {
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 15,
    color: '#111',
  },
  placeholder: {
    color: '#aaa',
  },
  // Dropdown modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#111',
  },
  selectedItem: {
    color: PURPLE,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b89aba',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
