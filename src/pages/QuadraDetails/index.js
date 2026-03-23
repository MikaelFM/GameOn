import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { QuadraFeatureItem } from '../../components/QuadraFeatureItem';
import { useNavigation } from '@react-navigation/native';

export default function QuadraDetails({ route }) {
  const navigation = useNavigation();
  const quadra = route.params.quadra;

  console.log(route.params)

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          
          <View style={styles.mainInfoCard}>
            <Image 
              source={{ uri: quadra.image }} 
              style={styles.cardImage} 
            />

            <View style={styles.headerSection}>
              <Text style={styles.courtTitle}>{quadra.name}</Text>
              <Text style={styles.addressText}>{quadra.address}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              <Text style={styles.subTitle}>Características</Text>
              <View style={styles.featuresList}>
                <QuadraFeatureItem icon="construct-outline" label="Piso de concreto" />
                <QuadraFeatureItem icon="business-outline" label="Coberta" />
                <QuadraFeatureItem icon="trophy-outline" label="Poliesportiva" />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.locationFooter}>
              <Ionicons name="location-sharp" size={18} color={COLORS.primary} />
              <Text style={styles.distanceText}>900m de distância</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Serviços</Text>
          <View style={styles.priceCard}>
            <Text style={styles.serviceName}>Quadra Poliesportiva</Text>
            <Text style={styles.priceValue}>
              <Text style={styles.priceGreen}>R$ 120,00</Text> / Hora
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reserveButton}
              onPress={() => navigation.navigate('ScheduleScreen', { quadra: quadra })}
            >
              <Text style={styles.reserveButtonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 30
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  mainInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 25,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  headerSection: {
    padding: 15,
  },
  courtTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textSub,
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  detailsSection: {
    padding: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  featuresList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSub,
  },
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 5,
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginBottom: 30,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.textSub,
  },
  priceGreen: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  reserveButton: {
    flex: 2,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});