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
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../contexts/AuthContext";

export default function Cadastro({
  isEditing = false,
  userData = null,
  onClose,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = route.params?.userType;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //implementar depois a autenticação com o backend, usando o useAuth para
  // gerenciar o estado de autenticação do usuário.

  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    if (isEditing && userData) {
      setNome(userData.nome);
      setEmail(userData.email);
    }
  }, []);

  const handleCancel = () => {
    if (isEditing) {
      onClose(); // fecha modal
    } else {
      navigation.goBack(); // volta no stack
    }
  };

  const handleSalvar = async () => {
    if (isEditing) {
      // depois: PUT no backend
      onClose();
    } else {
      // cadastro normal

      if (!nome || !email || !password || !confirmPassword) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Erro", "As senhas não conferem.");
        return;
      }

      if (password.length < 6) {
        Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
        return;
      }

      setLoading(true);
    }

    // Dados a serem enviados para a API
    const dadosUsuario = {
      userType,
      nome,
      email,
      password,
      role: userType,
    };

    // TODO: Implementar envio para API quando rotas estiverem definidas
    // try {
    //   const url = isEditing
    //     ? `https://api.gameon.com/users/${route.params?.userData?.id}`
    //     : "https://api.gameon.com/users/register";

    //   const metodo = isEditing ? "PUT" : "POST";

    //   const response = await fetch(url, {
    //     method: metodo,
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(dadosUsuario),
    //   });

    //   const result = await response.json();
    //   setLoading(false);

    //   if (response.ok) {
    //     Alert.alert(
    //       "Sucesso",
    //       isEditing
    //         ? "Perfil atualizado com sucesso!"
    //         : "Cadastro realizado com sucesso!",
    //     );

    //     if (isEditing) {
    //       navigation.goBack(); // Volta para a tela de perfil
    //     } else {
    //       if (userType === "owner") {
    //         navigation.navigate("formOwner", { ownerId: result.id });
    //       } else {
    //         navigation.replace("tabs");
    //       }
    //     }
    //   } else {
    //     Alert.alert("Erro", result.message || "Ocorreu um erro na operação.");
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   Alert.alert("Erro", "Erro de conexão. Verifique sua internet.");
    //   console.error(error);
    // }

    // Por enquanto, simula um ID retornado pela API
    setLoading(false);

    // if (userType === "owner") {
    //   navigation.navigate("formOwner", { ownerId: 1234 });
    // } else {
    //   signIn({
    //     user: result.user,
    //     token: result.token,
    //   });
    // }

    if (userType === "owner") {
      navigation.navigate("formOwner", { ownerId: 1234 });
    } else {
      signIn({
        user: {
          id: "fake-user-id",
          nome,
          email,
          role: "user",
        },
        token: "fake-token",
      });
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
              style={{ width: 220, height: 170 }}
            />
            <Text style={styles.cadastro}>
              {isEditing ? "Editar Perfil" : "Cadastro"}
            </Text>
            <Input
              placeholder="Insira seu nome"
              value={nome}
              onChangeText={setNome}
            />
            <Input
              placeholder="Insira seu e-mail"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Insira a senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
            <Input
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.container_buttons}>
            <Button
              label={"Cancelar"}
              type={"cancel"}
              onPress={handleCancel}
              disabled={loading}
            />
            <Button
              label={"Salvar"}
              onPress={handleSalvar}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 30,
  },
  container_buttons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "50%",
  },
  cadastro: {
    fontSize: 26,
    color: COLORS.textMain,
    marginBottom: 30,
    fontWeight: "500",
  },
});
