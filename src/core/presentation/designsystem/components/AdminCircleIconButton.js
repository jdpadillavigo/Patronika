import React from 'react';
import Colors from '../Colors';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function AdminCircleIconButton({
  iconName,
  onPress,
  label,
  count,
  iconLibrary = 'ion',
  disabled = false,
  style,
}) {
  const Icon = iconLibrary === 'material' ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity
      style={[styles.button, count > 0 && styles.buttonWithCount, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.84}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {count > 0 ? <Text style={styles.countText}>{count}</Text> : null}
      <Icon name={iconName} size={18} color={Colors.fixedWhite} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    elevation: 5,
    shadowColor: Colors.fixedBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonWithCount: {
    minWidth: 48,
    paddingHorizontal: 9,
  },
  countText: {
    color: Colors.fixedWhite,
    fontSize: 12,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.55,
  },
});
