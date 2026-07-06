import React from 'react';
import Colors from '../Colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../Theme';

export default function ProfileActionButton({ label, iconName, onPress, disabled = false, style }) {
  const { colors, isDark } = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { borderBottomColor: colors.textStrong }, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.78}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.label, { color: colors.textStrong }]}>{label}</Text>
      <View style={styles.iconSlot}>
        <Ionicons name={iconName} size={30} color={isDark ? Colors.fixedWhite : Colors.fixedBlack} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 62,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
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
