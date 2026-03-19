import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors'

export const QuadraFeatureItem = ({ icon, label }) => {
  return (
    <View style={styles.featureRow}>
        <Ionicons name={icon} size={17} color={COLORS.primary} />
        <Text style={styles.featureText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSub,
  },
});