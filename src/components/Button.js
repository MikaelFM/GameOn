import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const Button = ({ label, ...rest }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} {...rest}>
      <Text style={styles.texto}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "84%",
    height: 50,
    backgroundColor: "#2B9D48",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 30,
  },
  texto: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
});
