import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileActionButton({ label, iconName, onPress, disabled = false, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.78}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.iconSlot}>
        <Ionicons name={iconName} size={30} color="#000" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: '#111',
    fontSize: 16,
    fontWeight: '400',
  },
  iconSlot: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
});
