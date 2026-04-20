import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { QuadraCardWithPhoto } from "../../../components/QuadraCardWithPhoto";
import { COLORS } from "../../../constants/colors";

const QUADRAS = [
  {
    id: "1",
    name: "Arena Central - Quadra A",
    type: "Grama Sintética",
    price: "R$ 120/h",
    rating: 4.8,
    image:
      "https://sesisc.org.br/sites/default/files/styles/800x533/public/galeria/2021-02/quadra-poliesportiva.jpg?itok=vRxUWESB",
  },
  {
    id: "2",
    name: "Beach Tennis Pro",
    type: "Areia",
    price: "R$ 80/h",
    rating: 4.9,
    image:
      "https://jornalinformativo.com/wp-content/uploads/2023/04/Quadra-do-Ginasio-Poliesportivo-recebe-melhorias-1-1024x461.jpg",
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Proprietário!</Text>
          <Text style={styles.subGreeting}>
            Gerencie suas quadras cadastradas
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas quadras</Text>
        </View>

        {QUADRAS.map((quadra) => (
          <View key={quadra.id} style={styles.quadraWrapper}>
            <QuadraCardWithPhoto
              quadra={quadra}
              onPress={() => console.log("Detalhes da quadra")}
            />

            <View style={styles.quadraFooter}>
              <View style={styles.quadraInfo}>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={14} color="#FFC107" />
                  <Text style={styles.ratingText}>{quadra.rating}</Text>
                </View>

                <Text style={styles.quadraType}>{quadra.type}</Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => console.log("Editar quadra")}
              >
                <Feather name="edit-2" size={14} color={COLORS.primary} />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    gap: 10,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textMain,
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
});
