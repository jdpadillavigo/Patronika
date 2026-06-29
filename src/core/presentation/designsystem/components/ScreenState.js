import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function ScreenState({
  loading = false,
  iconName,
  text,
  subtext,
  actionText,
  onAction,
}) {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={PURPLE} />
      ) : iconName ? (
        <Ionicons name={iconName} size={52} color="#CCC" />
      ) : null}
      {text ? <Text style={styles.text}>{text}</Text> : null}
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
      {actionText && onAction ? (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  text: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtext: {
    color: '#BBB',
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    backgroundColor: PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
