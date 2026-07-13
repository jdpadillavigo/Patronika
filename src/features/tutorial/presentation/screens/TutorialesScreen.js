import React, { useState, useCallback, useMemo } from 'react';
import { useAppTheme } from '../../../../core/presentation/designsystem/Theme';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import AppTopBar from '../../../../core/presentation/designsystem/components/AppTopBar';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import { createTutorialesStyles, tutorialesStyles as styles, PURPLE } from '../styles/TutorialesStyles';
import TutorialCard from '../components/TutorialCard';
import TutorialUseCase from '../../domain/usecases/TutorialUseCase';
import { REFRESH_TOP_BAR_OFFSET } from '../../../../core/presentation/designsystem/components/CommonStyles';

export default function TutorialesScreen({navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createTutorialesStyles(colors), [colors]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tutorialsError, setTutorialsError] = useState('');

  const loadTutorials = useCallback(async (refresh = false) => {
    setRefreshing(refresh);
    setTutorialsError('');
    const result = await TutorialUseCase.getAll(refresh);
    if (result.success) setTutorials(result.data);
    else if (!result.sessionExpired) setTutorialsError(result.error);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadTutorials();
  }, [loadTutorials]));

  return (
    <View style={styles.safeArea}>
      <AppTopBar subtitle="Tutoriales" description="Aprende técnicas de tejido paso a paso" />

      {loading ? (
        <ScreenState loading text="Cargando tutoriales..." />
      ) : tutorials.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadTutorials(true)} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
        >
          <ScreenState
            iconName={tutorialsError ? 'cloud-offline-outline' : 'book-outline'}
            text={tutorialsError || 'Sin tutoriales aún'}
            subtext={tutorialsError ? undefined : 'Vuelve pronto para ver contenido nuevo'}
            actionText={tutorialsError ? 'Reintentar' : undefined}
            onAction={() => loadTutorials(true)}
          />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadTutorials(true)} colors={[PURPLE]} tintColor={PURPLE} progressViewOffset={REFRESH_TOP_BAR_OFFSET} />}
        >
          {tutorials.map(t => (
            <TutorialCard key={t.id} tutorial={t} />
          ))}
        </ScrollView>
      )}

      <UserBottomBar
        activeItem={UserBottomNavigationItem.TUTORIALS}
        onPressPatterns={() => navigation.navigate('MisPatrones')}
        onPressCommunity={() => navigation.navigate('Comunidad')}
        onPressTutorials={() => {}}
        onPressProfile={() => navigation.navigate('Perfil', { isAdmin: false })}
        onPressCamera={() => navigation.navigate('GenerarPatron')}
      />
    </View>
  );
}
