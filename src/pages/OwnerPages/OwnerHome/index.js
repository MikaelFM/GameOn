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
import { filtrarQuadras } from "../../../services/quadraService";

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
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : quadras.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma quadra cadastrada ainda.</Text>
        ) : (
          quadras.map((quadra) => (
            <View key={String(quadra.id)} style={styles.quadraWrapper}>
              <QuadraCardWithPhoto
                quadra={quadra}
                onPress={() => {}}
              />
              <View style={styles.quadraFooter}>
                <View style={styles.quadraInfo}>
                  {quadra.esporte && (
                    <Text style={styles.quadraType}>{quadra.esporte}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate("EditQuadra", { quadra })}
                >
                  <Feather name="edit-2" size={14} color={COLORS.primary} />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  quadraWrapper: {
    marginBottom: 20,
  },
  quadraFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginTop: -12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quadraInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  quadraType: {
    fontSize: 12,
    color: COLORS.textSub,
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
  emptyText: {
    textAlign: "center",
    color: COLORS.textSub,
    marginTop: 20,
    fontSize: 14,
  },
});
