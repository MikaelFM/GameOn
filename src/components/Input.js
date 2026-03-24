import { StyleSheet, TextInput } from "react-native";

export const Input = ({ ...rest }) => {
  return <TextInput style={styles.input} {...rest}></TextInput>;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#8d8d8d",
    color: "#000000",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    width: "84%",
  },
});
