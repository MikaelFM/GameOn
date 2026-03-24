import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const horarios = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

export function TimePicker({ selectedValue, onValueChange }) {
  return (
    <View style={styles.wrapper}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#2B9D48"
      >
        {horarios.map((hour) => (
          <Picker.Item
            key={hour}
            label={hour}
            value={hour}
            style={styles.item}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 2,
  },
  picker: {
    height: 50,
    color: "#333",
  },
  item: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
});
