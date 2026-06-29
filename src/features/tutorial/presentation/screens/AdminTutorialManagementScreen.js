import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AdminBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import AdminBottomBar from '../../../../core/presentation/designsystem/components/AdminBottomBar';
import AdminCircleIconButton from '../../../../core/presentation/designsystem/components/AdminCircleIconButton';
import AppTopBar from '../../../../core/presentation/designsystem/components/AppTopBar';
import ConfirmationModal from '../../../../core/presentation/designsystem/components/ConfirmationModal';
import FloatingIconButton from '../../../../core/presentation/designsystem/components/FloatingIconButton';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import TutorialUseCase from '../../domain/usecases/TutorialUseCase';
import TutorialCard from '../components/TutorialCard';
import { adminTutorialManagementStyles as styles } from '../styles/AdminTutorialManagementStyles';

const UNKNOWN_CONNECTION_ERROR = 'Ocurrió un error desconocido o de conexión. Inténtalo de nuevo.';

export default function AdminTutorialManagementScreen({ navigation }) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadTutorials = useCallback(async () => {
    setLoading(true);
    setError('');
    setActionError('');

    try {
      const result = await TutorialUseCase.getAll();
      if (!result.success) {
        if (!result.sessionExpired) setError(UNKNOWN_CONNECTION_ERROR);
        setTutorials([]);
        setLoading(false);
        return;
      }

      setTutorials(result.data || []);
      setLoading(false);
    } catch {
      setTutorials([]);
      setError(UNKNOWN_CONNECTION_ERROR);
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadTutorials();
  }, [loadTutorials]));

  const handleDelete = useCallback(async () => {
    if (!deleteCandidate) return;

    setDeleteLoading(true);
    setActionError('');
    try {
      const result = await TutorialUseCase.remove(deleteCandidate.id);
      setDeleteLoading(false);
      setDeleteCandidate(null);

      if (!result.success) {
        if (!result.sessionExpired) setActionError(UNKNOWN_CONNECTION_ERROR);
        return;
      }

      setTutorials(current => current.filter(item => item.id !== deleteCandidate.id));
    } catch {
      setDeleteLoading(false);
      setDeleteCandidate(null);
      setActionError(UNKNOWN_CONNECTION_ERROR);
    }
  }, [deleteCandidate]);

  const renderContent = () => {
    if (loading) {
      return <ScreenState loading text="Cargando tutoriales..." />;
    }

    if (error) {
      return (
        <ScreenState
          iconName="cloud-offline-outline"
          text={error}
          actionText="Reintentar"
          onAction={loadTutorials}
        />
      );
    }

    if (tutorials.length === 0) {
      return <ScreenState iconName="book-outline" text="No hay tutoriales registrados" />;
    }

    return (
      <>
        <Text style={styles.resultsCount}>
          Mostrando {tutorials.length} {tutorials.length === 1 ? 'tutorial' : 'tutoriales'}
        </Text>
        {actionError ? <Text style={styles.actionErrorText}>{actionError}</Text> : null}
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {tutorials.map(tutorial => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              actions={(
                <>
                  <AdminCircleIconButton
                    iconName="pencil-outline"
                    label="Editar tutorial"
                    onPress={() => navigation.navigate('EditarTutorialAdmin', { tutorialId: tutorial.id })}
                  />
                  <AdminCircleIconButton
                    iconName="trash-outline"
                    label="Eliminar tutorial"
                    onPress={() => setDeleteCandidate(tutorial)}
                  />
                </>
              )}
            />
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.safeArea}>
      <AppTopBar subtitle="Gestión de Tutoriales" />

      <View style={styles.content}>{renderContent()}</View>

      <AdminBottomBar
        activeItem={AdminBottomNavigationItem.TUTORIAL_MANAGEMENT}
        onPressUsers={() => navigation.navigate('GestionUsuarios')}
        onPressCommunity={() => navigation.navigate('GestionComunidadAdmin')}
        onPressTutorials={() => {}}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: true })}
      />

      {!loading && !error ? (
        <FloatingIconButton
          label="Agregar tutorial"
          onPress={() => navigation.navigate('AgregarTutorialAdmin')}
        />
      ) : null}

      <ConfirmationModal
        visible={!!deleteCandidate}
        title="¿Quieres eliminar este tutorial?"
        loading={deleteLoading}
        loadingText="Eliminando..."
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
      />
    </View>
  );
}
