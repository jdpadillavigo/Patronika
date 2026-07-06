import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import { useAppTheme } from '../Theme';

export default function ResourceFormHeader({ title, onBack }) {
  const { colors } = useAppTheme();

  return (
    <>
      <BackButton onPress={onBack} style={styles.backButton} />
      <Text style={[styles.title, { color: colors.textStrong }]}>{title}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: -32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 28,
  },
});
