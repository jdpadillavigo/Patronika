import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { UserBottomNavigationItem } from '../../../../core/domain/BottomNavigationItem';
import AppTopBar from '../../../../core/presentation/designsystem/components/AppTopBar';
import ScreenState from '../../../../core/presentation/designsystem/components/ScreenState';
import UserBottomBar from '../../../../core/presentation/designsystem/components/UserBottomBar';
import { tutorialesStyles as styles } from '../styles/TutorialesStyles';
import TutorialCard from '../components/TutorialCard';
import TutorialUseCase from '../../domain/usecases/TutorialUseCase';

export default function TutorialesScreen({ navigation }) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTutorials = useCallback(async () => {
    setLoading(true);
    const result = await TutorialUseCase.getAll();
    if (result.success) setTutorials(result.data);
    setLoading(false);
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
        <ScreenState
          iconName="book-outline"
          text="Sin tutoriales aún"
          subtext="Vuelve pronto para ver contenido nuevo"
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
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
