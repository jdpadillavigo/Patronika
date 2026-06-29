import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PURPLE, adminCommunityManagementStyles as styles } from '../styles/AdminCommunityManagementStyles';
import AdminCommunityUseCase from '../../domain/usecases/AdminCommunityUseCase';

export default function ReportDeletePatternScreen({ route, navigation }) {
  const publicationId = route?.params?.publicationId;
  const [warningMessage, setWarningMessage] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!publicationId || loading) return;

    setLoading(true);
    setError('');
    const result = await AdminCommunityUseCase.reportAndDeletePublication(publicationId, warningMessage, reason);
    setLoading(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      setError(result.error || 'No se pudo eliminar la publicación');
      return;
    }

    navigation.goBack();
  }, [loading, navigation, publicationId, reason, warningMessage]);

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

        <Text style={styles.reportTitle}>Reportar y{'\n'}eliminar patrón</Text>

        <View style={styles.reportFieldGroup}>
          <Text style={styles.reportLabel}>Mensaje de advertencia</Text>
          <TextInput
            value={warningMessage}
            onChangeText={setWarningMessage}
            placeholder="Mensaje"
            placeholderTextColor="#555"
            multiline
            style={[styles.reportInput, styles.reportTextArea]}
          />
        </View>

        <View style={styles.reportFieldGroup}>
          <Text style={styles.reportLabel}>Motivo de eliminación</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Motivo"
            placeholderTextColor="#555"
            style={styles.reportInput}
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
          onPress={handleDelete}
          disabled={loading}
          activeOpacity={0.84}
        >
          <Text style={styles.reportDangerButtonText}>{loading ? 'Eliminando...' : 'Eliminar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
