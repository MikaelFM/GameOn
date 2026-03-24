import { Image, Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/Button";
import { COLORS } from "../../constants/colors";

export default function Cadastro() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleUsuario = () => {
    navigation.navigate("formUser", { userType: "user" });
  };

  const handleLocatario = () => {
    navigation.navigate("formUser", { userType: "owner" });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo_gameOn.png")}
        style={{ width: 230, height: 190 }}
      />
      <Text style={styles.cadastro}>Cadastro</Text>

      <View style={styles.container_inputs}>
        <Button
          label={"Sou usuário"}
          onPress={handleUsuario}
          disabled={loading}
        />
        <Button
          label={"Sou locatário"}
          onPress={handleLocatario}
          disabled={loading}
        />
      </View>
      <View style={styles.container_buttons}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat",
            marginTop: 20,
          }}
        >
          Já possui conta?
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat",
            marginTop: 20,
            fontWeight: "bold",
          }}
          onPress={() => navigation.navigate("login")}
        >
          Faça login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  container_inputs: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  container_buttons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  cadastro: {
    fontSize: 26,
    color: COLORS.textMain,
    marginBottom: 20,
    fontWeight: "500",
  },
});
