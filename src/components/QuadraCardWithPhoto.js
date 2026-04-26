import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const QuadraCardWithPhoto = ({ quadra, onPress }) => {
  const preco = quadra.valorPorHora ? `R$ ${quadra.valorPorHora}/h` : 'Consultar';

  return (
    <TouchableOpacity style={styles.quadraCard} onPress={onPress}>
      <Image source={quadra.imagem ? { uri: quadra.imagem } : null} style={styles.quadraImage} />
      <View style={styles.quadraInfo}>
        <View style={styles.quadraHeader}>
          <Text style={styles.quadraName}>{quadra.nome}</Text>
          {quadra.rating != null && (
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{quadra.rating}</Text>
            </View>
          )}
        </View>
        {!!quadra.esporte && <Text style={styles.quadraType}>{quadra.esporte}</Text>}
        <Text style={styles.quadraPrice}>{preco}</Text>
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
    borderColor: COLORS.border,
  },
  quadraImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#EEE',
  },
  quadraInfo: {
    padding: 15,
  },
  quadraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quadraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 12,
  },
  quadraType: {
    color: COLORS.textSub,
    marginVertical: 4,
    fontSize: 14,
  },
  quadraPrice: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
