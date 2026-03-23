import { Image, Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/Button";

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
      <View style={styles.container_inputs}>
        <Image
          source={require("../../assets/images/gameon_logo1.png")}
          style={{ width: 200, height: 150, marginBottom: 30 }}
        />
        <Text style={styles.login}>Cadastro</Text>
      </View>

      <Button label={"Sou usuário"} onPress={handleUsuario} disabled={loading} />
      <Button
        label={"Sou locatário"}
        onPress={handleLocatario}
        disabled={loading}
      />
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  container_inputs: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container_buttons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  login: {
    fontSize: 36,
    fontFamily: "Montserrat",
    marginBottom: 30,
    fontWeight: "bold",
  },
});
