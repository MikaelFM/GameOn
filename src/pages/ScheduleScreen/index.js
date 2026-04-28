import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { listQuadrasComHorariosDisponiveis } from '../../services/quadraService';
import { createReserva } from '../../services/reservaService';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 20;
const VISIBLE_WIDTH = width - CONTAINER_PADDING * 2;

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function dateToISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function buildDayPages(numPages = 12) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pages = [];
  for (let p = 0; p < numPages; p++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + p * 7 + d);
      days.push(date);
    }
    pages.push({ id: `p${p}`, days });
  }
  return pages;
}

function formatPrice(valor) {
  if (!valor) return '—';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const TODAY_ISO = dateToISO(new Date());
const DAY_PAGES = buildDayPages();

export default function ScheduleScreen({ route }) {
  const quadra = route?.params?.quadra;

  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [visibleMonth, setVisibleMonth] = useState(
    `${MONTH_NAMES[new Date().getMonth()]} ${new Date().getFullYear()}`
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservando, setReservando] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstDay = viewableItems[0].item.days[0];
      setVisibleMonth(`${MONTH_NAMES[firstDay.getMonth()]} ${firstDay.getFullYear()}`);
    }
  });

  const fetchHorarios = useCallback(async (date) => {
    if (!quadra?.id) return;
    setLoading(true);
    setErro(null);
    setSelectedSlot(null);
    try {
      const response = await listQuadrasComHorariosDisponiveis({ quadraId: quadra.id, data: date });
      const resultado = Array.isArray(response.data) ? response.data[0] : null;
      setHorarios(resultado?.horariosDisponiveis ?? []);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar horários');
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, [quadra?.id]);

  useEffect(() => {
    fetchHorarios(selectedDate);
  }, [selectedDate, fetchHorarios]);

  async function handleReservar() {
    if (!selectedSlot) return;
    setReservando(true);
    try {
      await createReserva({
        quadraId: quadra.id,
        dataInicio: `${selectedDate}T${selectedSlot.inicio}:00`,
        dataFim: `${selectedDate}T${selectedSlot.fim}:00`,
      });
      Alert.alert('Reserva confirmada!', `Quadra reservada para ${selectedDate} às ${selectedSlot.inicio}.`);
      setSelectedSlot(null);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível realizar a reserva.');
    } finally {
      setReservando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>{quadra?.esporte || quadra?.nome || 'Quadra'}</Text>
          <Text style={styles.servicePrice}>
            <Text style={styles.priceGreen}>{formatPrice(quadra?.valorPorHora)}</Text> / Hora
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthText}>{visibleMonth}</Text>
          </View>

          <View style={styles.divider} />

          <FlatList
            data={DAY_PAGES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={VISIBLE_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={({ item }) => (
              <View style={styles.weekPage}>
                {item.days.map((date, index) => {
                  const iso = dateToISO(date);
                  const isSelected = iso === selectedDate;
                  const isToday = iso === TODAY_ISO;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.dayColumn}
                      onPress={() => setSelectedDate(iso)}
                    >
                      <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                        {DAY_NAMES[date.getDay()]}
                      </Text>
                      <View style={[styles.dateCircle, isSelected && styles.dateCircleActive]}>
                        <Text style={[styles.dayNumber, isSelected && styles.textWhite]}>
                          {date.getDate()}
                        </Text>
                      </View>
                      {isToday && <View style={[styles.todayDot, isSelected && styles.todayDotActive]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        <Text style={styles.sectionTitle}>Horários Disponíveis</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : erro ? (
          <Text style={styles.erroText}>{erro}</Text>
        ) : horarios.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum horário disponível para esta data</Text>
        ) : (
          <View style={styles.timesGrid}>
            {horarios.map((slot, index) => {
              const isSelected = selectedSlot?.inicio === slot.inicio;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSlot(slot)}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                >
                  <Text style={[styles.timeText, isSelected && styles.textWhite]}>
                    {slot.inicio}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={[styles.mainButton, (!selectedSlot || reservando) && styles.mainButtonDisabled]}
          disabled={!selectedSlot || reservando}
          onPress={handleReservar}
        >
          {reservando
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.mainButtonText}>Confirmar</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: CONTAINER_PADDING,
    paddingBottom: 100,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  servicePrice: {
    fontSize: 14,
    color: COLORS.textSub,
  },
  priceGreen: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 15,
    marginBottom: 25,
  },
  calendarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  weekPage: {
    flexDirection: 'row',
    width: VISIBLE_WIDTH,
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  dayColumn: {
    alignItems: 'center',
    width: VISIBLE_WIDTH / 7,
    paddingVertical: 8,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSub,
    marginBottom: 6,
  },
  dayNameActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  dateCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircleActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 17,
    overflow: 'hidden',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  textWhite: {
    color: '#FFF',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  todayDotActive: {
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.textMain,
  },
  loader: {
    marginTop: 20,
  },
  erroText: {
    textAlign: 'center',
    color: COLORS.textSub,
    fontSize: 14,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSub,
    fontSize: 14,
    marginTop: 20,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  timeSlot: {
    width: '45%',
    height: 46,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  mainButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  mainButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
