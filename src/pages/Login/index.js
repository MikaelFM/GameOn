import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { loginLocador, loginLocatario } from "../../services/loginService";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //implementar depois a autenticação com o backend, usando o useAuth para
  // gerenciar o estado de autenticação do usuário.
  // const { isLoggedIn, user } = useAuth();

  const { signIn } = useContext(AuthContext);

  const resolveApiErrorMessage = (error) => {
    return (
      error?.data?.erro ||
      error?.data?.mensagem ||
      error?.data?.message ||
      error?.message ||
      "Email ou senha invalidos."
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      let authResponse;

      try {
        authResponse = await loginLocador({ email, senha: password });
      } catch (firstError) {
        const canTryLocatario =
          firstError?.status === 401 ||
          firstError?.status === 403 ||
          firstError?.status === 404;

        if (!canTryLocatario) {
          throw firstError;
        }

        authResponse = await loginLocatario({ email, senha: password });
      }

      const userFromApi = authResponse?.usuario || {};

      await signIn({
        user: {
          ...userFromApi,
          email: userFromApi?.email || email,
          role: userFromApi?.role || "user",
        },
        token: authResponse?.token,
      });
    } catch (error) {
      setErrorMessage(resolveApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
              source={require("../../assets/images/logo_gameOn.png")}
              style={{ width: 230, height: 190 }}
            />
            <Text style={styles.login}>Login</Text>
            <Input
              placeholder="Insira o e-mail"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
            />
            <Input
              placeholder="Insira a senha"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              secureTextEntry={true}
            />
            {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </View>

          <Button label={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} loading={loading} />
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
    marginBottom: 20,
  },
  container_buttons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  login: {
    fontSize: 26,
    color: COLORS.textMain,
    marginBottom: 30,
    fontWeight: "500",
  },
  errorText: {
    width: "84%",
    color: "#C62828",
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Montserrat",
  },
});
