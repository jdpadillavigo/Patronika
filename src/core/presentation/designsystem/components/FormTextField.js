import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PURPLE } from './CommonStyles';

export default function FormTextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  inputProps,
  editable = true,
  labelRightAction,
  inputContainerStyle,
  inputStyle,
  style,
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.group, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelRightAction ? <View style={styles.labelAction}>{labelRightAction}</View> : null}
      </View>
      <View style={[styles.inputContainer, multiline && styles.textAreaContainer, inputContainerStyle]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          placeholderTextColor="#555"
          secureTextEntry={isPassword && !visible}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
          multiline={multiline}
          scrollEnabled={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[styles.input, multiline && styles.textAreaInput, inputStyle]}
          {...inputProps}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setVisible(current => !current)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 26,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#111',
    fontSize: 15,
    fontWeight: '800',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
    marginBottom: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 7,
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 15,
    paddingVertical: 0,
  },
  textAreaContainer: {
    height: 116,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  textAreaInput: {
    minHeight: 94,
    paddingVertical: 0,
  },
});
