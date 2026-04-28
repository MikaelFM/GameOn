import { useContext, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { QuadraCardWithPhoto } from "../../../components/QuadraCardWithPhoto";
import { COLORS } from "../../../constants/colors";
import { AuthContext } from "../../../contexts/AuthContext";
import { deleteQuadra, filtrarQuadras } from "../../../services/quadraService";

export default function OwnerHome() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [quadras, setQuadras] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      setLoading(true);
      filtrarQuadras({ locadorId: user.id })
        .then((res) => {
          const data = res.data;
          const lista = Array.isArray(data)
            ? data
            : Array.isArray(data?.quadras)
            ? data.quadras
            : Array.isArray(data?.data)
            ? data.data
            : [];
          setQuadras(lista);
        })
        .catch(() => setQuadras([]))
        .finally(() => setLoading(false));
    }, [user?.id])
  );

  const primeiroNome = user?.nome?.split(" ")[0] ?? "Proprietário";

  function confirmarExclusao(quadra) {
    Alert.alert(
      "Excluir quadra",
      `Deseja excluir ${quadra.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteQuadra(quadra.id);
              setQuadras((prev) => prev.filter((item) => item.id !== quadra.id));
            } catch (error) {
              Alert.alert("Erro", error.message || "Não foi possível excluir a quadra.");
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {primeiroNome}!</Text>
          <Text style={styles.subGreeting}>Gerencie suas quadras cadastradas</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas quadras</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("QuadraForm")}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : quadras.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma quadra cadastrada ainda.</Text>
        ) : (
          quadras.map((quadra) => (
            <QuadraCardWithPhoto
              key={String(quadra.id)}
              quadra={quadra}
              actions={
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("QuadraForm", { quadra })}
                  >
                    <Feather name="edit-2" size={14} color={COLORS.primary} />
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmarExclusao(quadra)}
                  >
                    <Feather name="trash-2" size={14} color="#B42318" />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </>
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(43,157,72,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(180,35,24,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B42318",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textSub,
    marginTop: 20,
    fontSize: 14,
  },
});
