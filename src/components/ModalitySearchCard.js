import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ModalitySearchCard({ title, icon }) {
  return (
    <TouchableOpacity style={styles.searchButton}>
        <Ionicons name={icon} size={16} color={'black'} />
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    alignSelf: 'flex-start',
    gap: 5,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 0,
    borderColor: '#E6E8EF',
    color: 'black'
  },
  text: {
    color: 'black',
    fontWeight: 500
  }
});