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
import { useRoute } from "@react-navigation/native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Picker } from "@react-native-picker/picker";

export default function Cadastro() {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = route.params?.userType || "owner"; // valor padrão "owner"
  const [nome, setNome] = useState("");
  const [selectedSport, setSelectedSport] = useState();
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horaAbertura, setHoraAbertura] = useState("08:00");
  const [horaFechamento, setHoraFechamento] = useState("18:00");
  const [loading, setLoading] = useState(false);
  //implementar depois a autenticação com o backend, usando o useAuth para
  // gerenciar o estado de autenticação do usuário.
  // const { isLoggedIn, user } = useAuth();

  const handleCadastro = async () => {
    if (!nome || !selectedSport || !valor || !descricao || !horaAbertura || !horaFechamento) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    // Dados a serem enviados para a API
    const dadosQuadra = {
      userType, // Incluindo o tipo de usuário
      nome,
      esporte: selectedSport,
      valor: parseFloat(valor),
      descricao,
      horaAbertura,
      horaFechamento,
    };

    // TODO: Implementar envio para API quando rotas estiverem definidas
    // try {
    //   const response = await fetch('https://api.gameon.com/quadras', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(dadosQuadra),
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     Alert.alert("Sucesso", "Quadra cadastrada com sucesso!");
    //     navigation.navigate("algumaTela");
    //   } else {
    //     Alert.alert("Erro", result.message || "Erro ao cadastrar quadra.");
    //   }
    // } catch (error) {
    //   Alert.alert("Erro", "Erro de conexão. Tente novamente.");
    // }

    // Por enquanto, apenas navega
    navigation.replace("tabs");
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
            <Text style={styles.login}>Cadastro</Text>
            <Input
              placeholder="Nome da Empresa"
              value={email}
              onChangeText={setNome}
            />
            <Picker
              selectedValue={selectedSport}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedSport(itemValue)
              }
            >
              <Picker.Item label="Futebol" value="futebol" />
              <Picker.Item label="Vôlei" value="volei" />
              <Picker.Item label="Basquete" value="basquete" />
              <Picker.Item label="Futsal" value="futsal" />
              <Picker.Item label="Tênis" value="tenis" />
              <Picker.Item label="Beach Tênis" value="beach_tenis" />
              <Picker.Item label="Handebol" value="handebol" />
              <Picker.Item label="Outros" value="outros" />
            </Picker>
            <Input
              placeholder="Valor do aluguel (por hora)"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />
            <Input
              placeholder="Descrição do espaço"
              value={descricao}
              onChangeText={setDescricao}
            />
            <Text style={{ fontSize: 16, marginTop: 20 }}>Horário de Abertura</Text>
            <Picker
              selectedValue={horaAbertura}
              onValueChange={(itemValue) => setHoraAbertura(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 18 }, (_, i) => {
                const hour = (i + 6).toString().padStart(2, '0') + ':00';
                return <Picker.Item key={hour} label={hour} value={hour} />;
              })}
            </Picker>
            <Text style={{ fontSize: 16, marginTop: 20 }}>Horário de Fechamento</Text>
            <Picker
              selectedValue={horaFechamento}
              onValueChange={(itemValue) => setHoraFechamento(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 18 }, (_, i) => {
                const hour = (i + 6).toString().padStart(2, '0') + ':00';
                return <Picker.Item key={hour} label={hour} value={hour} />;
              })}
            </Picker>

          <Button label={"Cancelar"} onPress={() => navigation.goBack()} disabled={loading} />
          <Button label={"Próximo"} onPress={handleCadastro} disabled={loading} />
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
  picker: {
    width: "84%",
    height: 50,
    marginVertical: 10,
  },
});
