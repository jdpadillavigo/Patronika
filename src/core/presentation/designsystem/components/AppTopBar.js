import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PURPLE } from './CommonStyles';

export default function AppTopBar({ subtitle, description, rightAction }) {
  return (
    <View style={styles.header}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Patrónika</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  description: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 2,
  },
  rightAction: {
    alignSelf: 'center',
  },
});
