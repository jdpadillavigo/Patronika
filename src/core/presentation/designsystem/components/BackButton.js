import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function BackButton({ onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Volver"
    >
      <Ionicons name="chevron-back" size={22} color={PURPLE} />
      <Text style={styles.text}>Volver</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 12,
    marginBottom: 18,
    minHeight: 28,
  },
  text: {
    color: PURPLE,
    fontSize: 15,
    fontWeight: '700',
  },
});
