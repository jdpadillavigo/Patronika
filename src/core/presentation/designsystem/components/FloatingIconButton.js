import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function FloatingIconButton({
  iconName = 'add',
  onPress,
  label,
  disabled = false,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={iconName} size={30} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 18,
    bottom: 86,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabled: {
    opacity: 0.65,
  },
});
