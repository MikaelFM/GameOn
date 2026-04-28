import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export default function CategorySearchCard({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={category.icon} size={24} color="#2E7D32" />
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryCard: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.card, 
    width: 80, 
    height: 90, 
    borderRadius: 16, 
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  categoryText: { 
    marginTop: 8, 
    fontSize: 12, 
    fontWeight: '500' 
  },
});