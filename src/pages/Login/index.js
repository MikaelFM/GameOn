import {
  Image,
  Text,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //implementar depois a autenticação com o backend, usando o useAuth para
  // gerenciar o estado de autenticação do usuário.
  // const { isLoggedIn, user } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    // setLoading(true);
    // const result = await login(email, password);
    // setLoading(false);

    // if (result.success) {
    //   Alert.alert("Sucesso", result.message);
    navigation.replace("options");
    // } else {
    //   Alert.alert("Erro", result.message);
    // }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={styles.container}>
          <View style={styles.container_inputs}>
            <Image
              source={require("../../assets/images/gameon_logo1.png")}
              style={{ width: 200, height: 150, marginBottom: 30 }}
            />
            <Text style={styles.login}>Login</Text>
            <Input placeholder="E-mail" value={email} onChangeText={setEmail} />
            <Input
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <Button label={"Entrar"} onPress={handleLogin} disabled={loading} />
          <View style={styles.container_buttons}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat",
                marginTop: 20,
              }}
            >
              Não possui conta?
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat",
                marginTop: 20,
                fontWeight: "bold",
              }}
              onPress={() => navigation.navigate("options")}
            >
              Cadastre-se
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
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
