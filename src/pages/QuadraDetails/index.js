import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LeafletMap } from '../../components/LeafletMap';
import { initLocation } from '../../services/locationService';
import { COLORS } from '../../constants/colors';
import { QuadraFeatureItem } from '../../components/QuadraFeatureItem';
import { useNavigation } from '@react-navigation/native';
import { getQuadraImageUri } from '../../services/quadraService';

function formatAddress(quadra) {
  const parts = [quadra.endereco, quadra.cidade, quadra.estado].filter(Boolean);
  return parts.join(", ") || "Endereço não informado";
}

function formatPrice(valor) {
  if (!valor) return "—";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatarDistancia(metros) {
  if (metros < 1000) return `${Math.round(metros)} m`;
  return `${(metros / 1000).toFixed(1)} km`;
}

export default function QuadraDetails({ route }) {
  const navigation = useNavigation();
  const quadra = route.params.quadra;
  const imageUri = getQuadraImageUri(quadra);
  const temLocalizacao = quadra.latitude != null && quadra.longitude != null;

  const [distancia, setDistancia] = useState(null);
  const [loadingDistancia, setLoadingDistancia] = useState(temLocalizacao);

  useEffect(() => {
    if (!temLocalizacao) return;
    initLocation()
      .then((coords) => {
        if (coords) {
          setDistancia(calcularDistancia(
            coords.latitude, coords.longitude,
            quadra.latitude, quadra.longitude,
          ));
        }
      })
      .finally(() => setLoadingDistancia(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>

          <View style={styles.mainInfoCard}>
            <Image
              source={imageUri ? { uri: imageUri } : null}
              style={styles.cardImage}
            />

            <View style={styles.headerSection}>
              <View style={styles.titleRow}>
                <Text style={styles.courtTitle}>{quadra.nome}</Text>
                {loadingDistancia && (
                  <ActivityIndicator size="small" color={COLORS.primary} style={styles.distanceLoader} />
                )}
                {!loadingDistancia && distancia !== null && (
                  <View style={styles.distanceBadge}>
                    <Ionicons name="location-sharp" size={12} color={COLORS.primary} style={{ marginRight: 2 }} />
                    <Text style={styles.distanceBadgeText}>{formatarDistancia(distancia)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{formatAddress(quadra)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              {quadra.descricao ? (
                <>
                  <Text style={styles.subTitle}>Descrição</Text>
                  <Text style={styles.descricaoText}>{quadra.descricao}</Text>
                </>
              ) : null}

              <Text style={[styles.subTitle, quadra.descricao && styles.subTitleSpaced]}>
                Características
              </Text>
              <View style={styles.featuresList}>
                {quadra.esporte ? (
                  <QuadraFeatureItem icon="trophy-outline" label={quadra.esporte} />
                ) : null}
                {quadra.locador?.nome ? (
                  <QuadraFeatureItem icon="person-outline" label={quadra.locador.nome} />
                ) : null}
                {quadra.cep ? (
                  <QuadraFeatureItem icon="mail-outline" label={`CEP: ${quadra.cep}`} />
                ) : null}
              </View>
            </View>

            {temLocalizacao && (
              <>
                <View pointerEvents="none" style={styles.mapWrapper}>
                  <LeafletMap
                    latitude={quadra.latitude}
                    longitude={quadra.longitude}
                  />
                </View>
              </>
            )}
          </View>

          <Text style={styles.sectionLabel}>Serviços</Text>
          <View style={styles.priceCard}>
            <Text style={styles.serviceName}>{quadra.esporte || quadra.nome}</Text>
            <Text style={styles.priceValue}>
              <Text style={styles.priceGreen}>{formatPrice(quadra.valorPorHora)}</Text> / Hora
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('search', { screen: 'Home' })}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => navigation.navigate('ScheduleScreen', { quadra })}
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
    paddingBottom: 100,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  courtTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    flexShrink: 1,
    marginRight: 8,
  },
  distanceLoader: {
    flexShrink: 0,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: `${COLORS.primary}1A`,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  distanceBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
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
  subTitleSpaced: {
    marginTop: 16,
  },
  descricaoText: {
    fontSize: 14,
    color: COLORS.textSub,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresList: {
    gap: 10,
  },
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  distanceBadge: {
    backgroundColor: `${COLORS.primary}1A`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceBadgeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  mapWrapper: {
    height: 180,
    padding: 10,
    paddingTop: 0,
    borderRadius: 8,
  },
  map: {
    flex: 1,
    borderRadius: 8,
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
