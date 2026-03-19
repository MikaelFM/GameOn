import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const QuadraCardWithPhoto = ({ quadra, onPress }) => {
  return (
     <TouchableOpacity style={styles.quadraCard}>
        <Image source={{ uri: quadra.image }} style={styles.quadraImage} />
        <View style={styles.quadraInfo}>
            <View style={styles.quadraHeader}>
            <Text style={styles.quadraName}>{quadra.name}</Text>
            <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{quadra.rating}</Text>
            </View>
            </View>
            <Text style={styles.quadraType}>{quadra.type}</Text>
            <Text style={styles.quadraPrice}>{quadra.price}</Text>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quadraCard: { 
    backgroundColor: COLORS.card, 
    borderRadius: 16, 
    marginBottom: 15, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border 
  },
  quadraImage: { 
    width: '100%', 
    height: 150 
  },
  quadraInfo: { 
    padding: 15 
  },
  quadraHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  quadraName: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: COLORS.textMain
  },
  ratingBox: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  ratingText: { 
    marginLeft: 4, 
    fontWeight: 'bold',
    fontSize: 12
  },
  quadraType: { 
    color: COLORS.textSub, 
    marginVertical: 4,
    fontSize: 14
  },
  quadraPrice: { 
    color: COLORS.primary, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});