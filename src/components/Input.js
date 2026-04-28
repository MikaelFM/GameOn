import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const Input = ({ secureTextEntry, style, ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrap, style && style.container]}>
      <TextInput
        style={[styles.input, style && style.input]}
        secureTextEntry={secureTextEntry && !visible}
        {...rest}
      />
      {secureTextEntry && (
        <TouchableOpacity style={styles.toggle} onPress={() => setVisible(v => !v)}>
          <Ionicons name={visible ? 'eye' : 'eye-off'} size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '84%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#8d8d8d",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    color: "#000000",
    padding: 15,
  },
  toggle: {
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 4,
  },
});
