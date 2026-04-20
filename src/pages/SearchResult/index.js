import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import QuadraDetails from "../QuadraDetails";

const FILTERS = [
  { id: "1", label: "Cidade", icon: "location-sharp", active: true },
  { id: "2", label: "Data", icon: "calendar-outline", active: false },
  { id: "3", label: "Horário", icon: "time-outline", active: false },
  { id: "4", label: "Esporte", icon: "football-outline", active: false },
];

const SEARCH_RESULTS = [
  {
    id: "1",
    name: "Quadra 1",
    address: "Rua nº 1, Bairro n, Farroupilha",
    details: "900m - Futsal - Coberta",
    image:
      "https://jornalinformativo.com/wp-content/uploads/2023/04/Quadra-do-Ginasio-Poliesportivo-recebe-melhorias-1-1024x461.jpg",
  },
  {
    id: "2",
    name: "Quadra 2",
    address: "Rua nº 2, Bairro m, Farroupilha",
    details: "900m - Futsal - Coberta",
    image:
      "https://sesisc.org.br/sites/default/files/styles/800x533/public/galeria/2021-02/quadra-poliesportiva.jpg?itok=vRxUWESB",
  },
  {
    id: "3",
    name: "Quadra 3",
    address: "Rua nº 3, Bairro f, Farroupilha",
    details: "900m - Futsal - Coberta",
    image:
      "https://jornalinformativo.com/wp-content/uploads/2023/04/Quadra-do-Ginasio-Poliesportivo-recebe-melhorias-1-1024x461.jpg",
  },
  {
    id: "4",
    name: "Quadra 4",
    address: "Rua nº 4, Bairro g, Farroupilha",
    details: "900m - Futsal - Coberta",
    image:
      "https://sesisc.org.br/sites/default/files/styles/800x533/public/galeria/2021-02/quadra-poliesportiva.jpg?itok=vRxUWESB",
  },
  {
    id: "5",
    name: "Quadra 5",
    address: "Rua nº 5, Bairro c, Farroupilha",
    details: "900m - Futsal - Coberta",
    image:
      "https://jornalinformativo.com/wp-content/uploads/2023/04/Quadra-do-Ginasio-Poliesportivo-recebe-melhorias-1-1024x461.jpg",
  },
];

export default function SearchResult() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSub} />
          <TextInput placeholder="Pesquise aqui" style={styles.searchInput} />
        </View>

        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterItem,
                  filter.active && styles.filterItemActive,
                ]}
              >
                <Ionicons
                  name={filter.icon}
                  size={16}
                  color={filter.active ? "#FFF" : COLORS.textMain}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter.active && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={SEARCH_RESULTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() =>
                navigation.navigate("QuadraDetails", { quadra: item })
              }
            >
              <Image source={{ uri: item.image }} style={styles.resultImage} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultAddress}>{item.address}</Text>
                <View style={styles.cardDivider} />
                <Text style={styles.resultDetails}>{item.details}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 75,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 15,
    marginTop: 10,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#FFF",
  },
  listPadding: {
    padding: 20,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    overflow: "hidden",
    height: 100,
  },
  resultImage: {
    width: 100,
    height: "100%",
    backgroundColor: "#EEE",
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  resultAddress: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  resultDetails: {
    fontSize: 11,
    color: COLORS.textSub,
  },
});
