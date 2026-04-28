import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";

export const Button = ({ label, type, loading = false, disabled = false, style, ...rest }) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        type == "cancel" ? styles.container_cancel : styles.container,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      activeOpacity={0.6}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={type == "cancel" ? COLORS.primary : "#fff"} />
      ) : (
        <Text style={type == "cancel" ? styles.texto_cancel : styles.texto}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "84%",
    height: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  container_cancel: {
    width: "84%",
    height: 50,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  texto: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
  texto_cancel: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.7,
  },
});
