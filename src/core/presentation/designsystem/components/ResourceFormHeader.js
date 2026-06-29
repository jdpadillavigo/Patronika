import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BackButton from './BackButton';

export default function ResourceFormHeader({ title, onBack }) {
  return (
    <>
      <BackButton onPress={onBack} style={styles.backButton} />
      <Text style={styles.title}>{title}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: -32,
  },
  title: {
    color: '#262626',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 28,
  },
});
