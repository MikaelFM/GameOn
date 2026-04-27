import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export function SportCheckboxGroup({ selected = [], onToggle, options = [], loading = false }) {
  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <Text style={styles.loadingText}>Carregando esportes...</Text>
      </View>
    );
  }

  if (!options.length) {
    return (
      <View style={styles.loadingBox}>
        <Text style={styles.loadingText}>Nenhum esporte disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.group}>
      {options.map((sport) => {
        const sportId = Number(sport.id);
        const checked = selected.map(Number).includes(sportId);
        return (
          <TouchableOpacity
            key={String(sportId)}
            style={styles.row}
            onPress={() => onToggle(sportId)}
          >
            <View style={[styles.checkbox, checked && styles.checked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{sport.nome}</Text>
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
  loadingBox: {
    width: "84%",
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSub,
    textAlign: "center",
  },
});
