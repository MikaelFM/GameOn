import { StyleSheet, TextInput } from "react-native";

export const Input = ({ ...rest }) => {
  return <TextInput style={styles.input} {...rest}></TextInput>;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#8d8d8d",
    color: "#6d6c6c",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: "84%",
  },
});
