import React, { useCallback, useState, useMemo } from 'react';
import { useAppTheme } from '../../../../../core/presentation/designsystem/Theme';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import BackButton from '../../../../../core/presentation/designsystem/components/BackButton';
import { createSanctionUserDeletePublicationStyles, sanctionUserDeletePublicationStyles as styles } from '../styles/SanctionUserDeletePublicationStyles';
import AdminCommunityUseCase from '../../domain/usecases/AdminCommunityUseCase';

export default function SanctionUserDeletePublicationScreen({route, navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createSanctionUserDeletePublicationStyles(colors), [colors]);
  const targetType = route?.params?.targetType === 'comment' ? 'comment' : 'publication';
  const targetId = targetType === 'comment' ? route?.params?.commentId : route?.params?.publicationId;
  const [suspensionDays, setSuspensionDays] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canSubmit = suspensionDays.trim() && reason.trim() && !loading;

  const handleSanctionAndDelete = useCallback(async () => {
    if (!targetId || loading) return;

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
    const result = targetType === 'comment'
      ? await AdminCommunityUseCase.sanctionUserAndDeleteComment(targetId, sanctionDraft)
      : await AdminCommunityUseCase.sanctionUserAndDeletePublication(targetId, sanctionDraft);
    setLoading(false);

    if (!result.success) {
      if (result.sessionExpired) return;
      setError(result.error || 'No se pudo completar la acción. Revisa tu conexión e inténtalo nuevamente.');
      return;
    }

    navigation.goBack();
  }, [loading, navigation, reason, suspensionDays, targetId, targetType]);

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
        <BackButton onPress={() => navigation.goBack()} style={styles.reportBackButton} />

        <Text style={styles.reportTitle}>
          Sancionar usuario y eliminar {targetType === 'comment' ? 'comentario' : 'publicación'}
        </Text>

        <View style={styles.reportFieldGroup}>
          <Text style={styles.reportLabel}>Cantidad de días</Text>
          <TextInput
            value={suspensionDays}
            onChangeText={text => setSuspensionDays(text.replace(/[^0-9]/g, ''))}
            placeholder="Días"
            placeholderTextColor={colors.textSecondary}
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
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={250}
            scrollEnabled={false}
            style={[styles.reportInput, styles.reportTextArea]}
          />
        </View>

        {error ? <Text style={styles.reportErrorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.reportDangerButton, !canSubmit && styles.reportButtonDisabled]}
          onPress={handleSanctionAndDelete}
          disabled={!canSubmit}
          activeOpacity={0.84}
        >
          <Text style={styles.reportDangerButtonText}>{loading ? 'Procesando...' : 'Eliminar y sancionar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
