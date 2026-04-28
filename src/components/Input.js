import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const Input = ({ secureTextEntry, style, ...rest }) => {
  const [visible, setVisible] = useState(!secureTextEntry);

  return (
    <View style={[styles.wrap, style && style.container]}>
      <TextInput
        style={[styles.input, style && style.input]}
        secureTextEntry={secureTextEntry && !visible}
        {...rest}
      />
      {secureTextEntry && (
        <TouchableOpacity style={styles.toggle} onPress={() => setVisible(v => !v)}>
          <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '84%',
    position: 'relative',
    marginVertical: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#8d8d8d",
    color: "#000000",
    padding: 15,
    borderRadius: 10,
    paddingRight: 44,
  },
  toggle: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 4,
  },
});
