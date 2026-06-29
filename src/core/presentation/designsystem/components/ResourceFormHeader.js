import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function ResourceFormHeader({ title, onBack }) {
  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.75}>
        <Ionicons name="chevron-back" size={28} color={PURPLE} />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: -10,
    marginBottom: 26,
  },
  backText: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: '#262626',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 28,
  },
});
