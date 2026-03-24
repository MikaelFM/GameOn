import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const sports = [
  "Futebol",
  "Vôlei",
  "Basquete",
  "Futsal",
  "Tênis",
  "Beach Tênis",
  "Handebol",
  "Outros",
];

export function SportCheckboxGroup({ selected, onToggle }) {
  return (
    <View style={styles.group}>
      {sports.map((sport) => {
        const checked = selected.includes(sport);
        return (
          <TouchableOpacity
            key={sport}
            style={styles.row}
            onPress={() => onToggle(sport)}
          >
            <View style={[styles.checkbox, checked && styles.checked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{sport}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: "84%",
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    width: "48%",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  label: { fontSize: 16 },
});
