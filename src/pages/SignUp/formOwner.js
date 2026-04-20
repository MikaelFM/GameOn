import {
  Text,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { TimePicker } from "../../components/TimePicker";
import { SportCheckboxGroup } from "../../components/SportCheckboxGroup";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../contexts/AuthContext";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

export default function Cadastro() {
  const navigation = useNavigation();
  const route = useRoute();
  const ownerId = route.params?.ownerId;
  const [nome, setNome] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horariosPorDia, setHorariosPorDia] = useState({
    Seg: { abertura: "08:00", fechamento: "18:00" },
    Ter: { abertura: "08:00", fechamento: "18:00" },
    Qua: { abertura: "08:00", fechamento: "18:00" },
    Qui: { abertura: "08:00", fechamento: "18:00" },
    Sex: { abertura: "08:00", fechamento: "18:00" },
    Sab: { abertura: "08:00", fechamento: "18:00" },
    Dom: { abertura: "08:00", fechamento: "18:00" },
  });
  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext);

  const toggleSport = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  };

  const handleCadastro = async () => {
    if (!nome || selectedSports.length === 0 || !valor || !descricao) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos e selecione ao menos um esporte.",
      );
      return;
    }

    const dadosQuadra = {
      ownerId,
      nome,
      esportes: selectedSports,
      valor: parseFloat(valor),
      descricao,
      horarios: horariosPorDia,
    };

    // TODO: Implementar envio para API
    console.log("=== DADOS DA QUADRA ===");
    console.log(JSON.stringify(dadosQuadra, null, 2));

    signIn({
      user: {
        id: ownerId ?? "fake-owner-id",
        nome: "Owner Teste",
        role: "owner",
      },
      token: "fake-token",
    });
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        marginTop: Platform.OS === "android" ? 80 : 0,
        marginBottom: Platform.OS === "android" ? 80 : 0,
      }}
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
            <Text style={styles.cadastro}>Cadastro</Text>
            <Input
              placeholder="Insira o nome da empresa"
              value={nome}
              onChangeText={setNome}
            />

            <Input
              placeholder="Insira o valor do aluguel (por hora)"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />
            <Input
              placeholder="Insira a descrição do espaço"
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.sectionLabel}>Esportes disponíveis</Text>
            <SportCheckboxGroup
              selected={selectedSports}
              onToggle={toggleSport}
            />

            <Text style={styles.sectionLabel}>Horários por dia</Text>
            <View style={styles.horarioHeader}>
              <Text style={{ width: 50 }}></Text>
              <Text style={styles.horarioColLabel}>Abertura</Text>
              <Text style={styles.horarioColLabel}>Fechamento</Text>
            </View>

            {dias.map((dia) => (
              <View key={dia} style={styles.horarioRow}>
                <Text style={styles.diaLabel}>{dia}</Text>
                <TimePicker
                  selectedValue={horariosPorDia[dia].abertura}
                  onValueChange={(val) =>
                    setHorariosPorDia((prev) => ({
                      ...prev,
                      [dia]: { ...prev[dia], abertura: val },
                    }))
                  }
                />
                <TimePicker
                  selectedValue={horariosPorDia[dia].fechamento}
                  onValueChange={(val) =>
                    setHorariosPorDia((prev) => ({
                      ...prev,
                      [dia]: { ...prev[dia], fechamento: val },
                    }))
                  }
                />
              </View>
            ))}

            <View style={styles.container_buttons}>
              <Button
                label={"Cancelar"}
                type={"cancel"}
                onPress={() => navigation.goBack()}
                disabled={loading}
              />
              <Button
                label={"Salvar"}
                onPress={handleCadastro}
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container_inputs: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container_buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "50%",
    marginTop: 20,
  },
  cadastro: {
    fontSize: 32,
    color: COLORS.textMain,
    marginBottom: 20,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "500",
  },

  selectBtn: {
    width: "84%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  horarioHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    margin: 5,
  },
  horarioColLabel: {
    flex: 1,
    textAlign: "left",
    fontSize: 14,
    color: "#666",
  },
  horarioRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "84%",
    marginBottom: 8,
    gap: 8,
  },
  diaLabel: {
    width: 40,
    fontWeight: "bold",
    fontSize: 14,
  },
});
