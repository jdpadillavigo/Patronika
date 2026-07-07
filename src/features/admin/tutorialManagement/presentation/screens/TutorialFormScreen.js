import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useAppTheme } from '../../../../../core/presentation/designsystem/Theme';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import FormTextField from '../../../../../core/presentation/designsystem/components/FormTextField';
import ResourceFormHeader from '../../../../../core/presentation/designsystem/components/ResourceFormHeader';
import { useErrorPopup } from '../../../../../core/presentation/designsystem/components/ErrorPopup';
import TutorialUseCase from '../../../../tutorial/domain/usecases/TutorialUseCase';
import { createAdminTutorialManagementStyles, adminTutorialManagementStyles as styles, PURPLE } from '../styles/AdminTutorialManagementStyles';

export default function TutorialFormScreen({route, navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createAdminTutorialManagementStyles(colors), [colors]);
  const tutorialId = route?.params?.tutorialId || null;
  const isEditing = !!tutorialId;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [initialValues, setInitialValues] = useState({ title: '', description: '', url: '' });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showError, errorPopup } = useErrorPopup();

  useEffect(() => {
    let mounted = true;

    async function loadTutorial() {
      if (!tutorialId) return;

      setLoading(true);
      setError('');
      const result = await TutorialUseCase.getById(tutorialId);
      if (!mounted) return;

      if (!result.success) {
        if (!result.sessionExpired) setError(result.error || 'No se pudo cargar el tutorial.');
        setLoading(false);
        return;
      }

      const loadedTitle = result.data?.title || '';
      const loadedDescription = result.data?.description || '';
      const loadedUrl = TutorialUseCase.normalizeUrl(result.data?.url || '');
      setTitle(loadedTitle);
      setDescription(loadedDescription);
      setUrl(loadedUrl);
      setInitialValues({
        title: loadedTitle,
        description: loadedDescription,
        url: loadedUrl,
      });
      setLoading(false);
    }

    loadTutorial();
    return () => {
      mounted = false;
    };
  }, [tutorialId]);

  const normalizedCurrentUrl = TutorialUseCase.normalizeUrl(url);
  const hasChanges = !isEditing
    || title.trim() !== initialValues.title.trim()
    || description.trim() !== initialValues.description.trim()
    || normalizedCurrentUrl.trim() !== initialValues.url.trim();
  const canSubmit = title.trim() && description.trim() && url.trim() && hasChanges && !saving;

  const handleSave = useCallback(async () => {
    if (!canSubmit) return;

    if (/^http:\/\//i.test(url.trim())) {
      showError('La URL del video debe empezar con https://');
      return;
    }

    const normalizedUrl = TutorialUseCase.normalizeUrl(url);
    setUrl(normalizedUrl);
    setSaving(true);
    setError('');

    const result = isEditing
      ? await TutorialUseCase.update(tutorialId, title, description, normalizedUrl)
      : await TutorialUseCase.create(title, description, normalizedUrl);

    setSaving(false);

    if (!result.success) {
      if (!result.sessionExpired) {
        const message = result.error || 'No se pudo guardar el tutorial.';
        if (message === 'No se permite videos de esa fuente ingresada') {
          showError(message);
        } else {
          setError(message);
        }
      }
      return;
    }

    navigation.goBack();
  }, [canSubmit, description, isEditing, navigation, showError, title, tutorialId, url]);

  return (
    <KeyboardAvoidingView
      style={styles.formSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.formSafeArea}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <ResourceFormHeader
          title={isEditing ? 'Editar tutorial' : 'Agregar tutorial'}
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.formLoadingContainer}>
            <ActivityIndicator size="large" color={PURPLE} />
            <Text style={styles.emptyText}>Cargando tutorial...</Text>
          </View>
        ) : (
          <>
            <FormTextField
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
              inputProps={{ maxLength: 120 }}
            />

            <FormTextField
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción"
              multiline
              inputProps={{ maxLength: 500 }}
            />

            <FormTextField
              label="URL del video"
              value={url}
              onChangeText={setUrl}
              placeholder="https://"
              inputProps={{
                keyboardType: 'url',
                autoCapitalize: 'none',
              }}
            />

            {error ? <Text style={styles.formErrorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, !canSubmit && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Procesando...' : isEditing ? 'Guardar' : 'Agregar'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      {errorPopup}
    </KeyboardAvoidingView>
  );
}
