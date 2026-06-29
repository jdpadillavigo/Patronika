import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PURPLE, sanctionUserDeletePublicationStyles as styles } from '../styles/SanctionUserDeletePublicationStyles';
import AdminCommunityUseCase from '../../domain/usecases/AdminCommunityUseCase';

export default function SanctionUserDeletePublicationScreen({ route, navigation }) {
  const publicationId = route?.params?.publicationId;
  const [suspensionDays, setSuspensionDays] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSanctionAndDelete = useCallback(async () => {
    if (!publicationId || loading) return;

    const days = Number.parseInt(suspensionDays, 10);
    if (!Number.isInteger(days) || days <= 0) {
      setError('Ingresa una cantidad de días válida.');
      return;
    }
    if (!reason.trim()) {
      setError('Ingresa el motivo de suspensión.');
      return;
    }

    setLoading(true);
    setError('');
    const sanctionDraft = { days, reason: reason.trim() };
    const result = await AdminCommunityUseCase.sanctionUserAndDeletePublication(publicationId, sanctionDraft);
    setLoading(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      setError(result.error || 'No se pudo completar la acción. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }

    navigation.goBack();
  }, [loading, navigation, publicationId, reason, suspensionDays]);

  return (
    <KeyboardAvoidingView
      style={styles.reportSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.reportSafeArea}
        contentContainerStyle={styles.reportContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.reportBackButton} onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={28} color={PURPLE} />
          <Text style={styles.reportBackText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.reportTitle}>Sancionar usuario y eliminar publicación</Text>

        <View style={styles.reportFieldGroup}>
          <Text style={styles.reportLabel}>Cantidad de días</Text>
          <TextInput
            value={suspensionDays}
            onChangeText={text => setSuspensionDays(text.replace(/[^0-9]/g, ''))}
            placeholder="Días"
            placeholderTextColor="#555"
            keyboardType="number-pad"
            maxLength={3}
            style={styles.reportInput}
          />
        </View>

        <View style={styles.reportFieldGroup}>
          <Text style={styles.reportLabel}>Motivo de suspensión</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Motivo"
            placeholderTextColor="#555"
            multiline
            maxLength={250}
            scrollEnabled={false}
            style={[styles.reportInput, styles.reportTextArea]}
          />
        </View>

        {error ? <Text style={styles.reportErrorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.reportPrimaryButton, loading && styles.reportButtonDisabled]}
          onPress={() => navigation.goBack()}
          disabled={loading}
          activeOpacity={0.84}
        >
          <Text style={styles.reportPrimaryButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.reportDangerButton, loading && styles.reportButtonDisabled]}
          onPress={handleSanctionAndDelete}
          disabled={loading}
          activeOpacity={0.84}
        >
          <Text style={styles.reportDangerButtonText}>{loading ? 'Procesando...' : 'Sancionar y eliminar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
