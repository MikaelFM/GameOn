import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { getQuadraImageUri } from '../services/quadraService';

function formatarDistancia(metros) {
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1)} km`;
}

export const QuadraCardWithPhoto = ({ quadra, onPress, actions, footerLeftContent, footerRightContent, distancia }) => {
  const preco = quadra.valorPorHora ? `R$ ${quadra.valorPorHora}/h` : 'Consultar';
  const imageUri = getQuadraImageUri(quadra);

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={styles.quadraCard} 
      onPress={onPress} 
      activeOpacity={0.85}
    >
      <Image source={imageUri ? { uri: imageUri } : null} style={styles.quadraImage} />
      
      <View style={styles.quadraInfo}>
        <View style={styles.quadraHeader}>
          <Text style={styles.quadraName}>{quadra.nome}</Text>
          {quadra.rating != null && (
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{quadra.rating}</Text>
            </View>
          )}
          {distancia != null && (
            <View style={styles.distanceBadge}>
              <Ionicons name="location-sharp" size={11} color={COLORS.primary} style={{ marginRight: 2 }} />
              <Text style={styles.distanceText}>{formatarDistancia(distancia)}</Text>
            </View>
          )}
        </View>

        {!!quadra.esporte && <Text style={styles.quadraType}>{quadra.esporte}</Text>}

        <View style={styles.priceActionRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.quadraPrice}>{preco}</Text>
            {footerLeftContent}
          </View>

          <View style={styles.actionsContainer}>
            {footerRightContent || actions}
          </View>
        </View>
      </View>
    </Container>
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
    color: COLORS.textMain,
  },
  quadraType: {
    color: COLORS.textSub,
    marginVertical: 4,
    fontSize: 14,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}1A`,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  distanceText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  priceActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  priceContainer: {
    flex: 1,
  },
  quadraPrice: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});