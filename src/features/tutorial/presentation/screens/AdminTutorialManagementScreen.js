import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { AdminBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import AdminBottomBar from '../../../../core/presentation/designsystem/components/AdminBottomBar';
import AdminCircleIconButton from '../../../../core/presentation/designsystem/components/AdminCircleIconButton';
import ConfirmationModal from '../../../../core/presentation/designsystem/components/ConfirmationModal';
import FloatingIconButton from '../../../../core/presentation/designsystem/components/FloatingIconButton';
import TutorialUseCase from '../../domain/usecases/TutorialUseCase';
import TutorialCard from '../components/TutorialCard';
import { adminTutorialManagementStyles as styles, PURPLE } from '../styles/AdminTutorialManagementStyles';

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

    const result = await TutorialUseCase.getAll();
    if (!result.success) {
      if (!result.sessionExpired) setError(result.error || 'No se pudieron cargar los tutoriales.');
      setTutorials([]);
      setLoading(false);
      return;
    }

    setTutorials(result.data || []);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadTutorials();
  }, [loadTutorials]));

  const handleDelete = useCallback(async () => {
    if (!deleteCandidate) return;

    setDeleteLoading(true);
    setActionError('');
    const result = await TutorialUseCase.remove(deleteCandidate.id);
    setDeleteLoading(false);
    setDeleteCandidate(null);

    if (!result.success) {
      if (!result.sessionExpired) setActionError(result.error || 'No se pudo eliminar el tutorial.');
      return;
    }

    setTutorials(current => current.filter(item => item.id !== deleteCandidate.id));
  }, [deleteCandidate]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PURPLE} />
          <Text style={styles.emptyText}>Cargando tutoriales...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={52} color="#CCC" />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTutorials}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tutorials.length === 0) {
      return (
        <View style={styles.centered}>
          <Ionicons name="book-outline" size={52} color="#DDD" />
          <Text style={styles.emptyText}>No hay tutoriales registrados</Text>
        </View>
      );
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patrónika</Text>
      </View>

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
