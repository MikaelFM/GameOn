import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { 
  CalendarProvider, 
  ExpandableCalendar, 
  LocaleConfig 
} from 'react-native-calendars';
import { COLORS } from '../../constants/colors';
import { listQuadrasComHorariosDisponiveis } from '../../services/quadraService';
import { createReserva } from '../../services/reservaService';

// 1. Configuração de Localização
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const TODAY_ISO = new Date().toISOString().split('T')[0];

export default function ScheduleScreen({ route }) {
  const quadra = route?.params?.quadra;

  // Estados
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservando, setReservando] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  // Busca de horários
  const fetchHorarios = useCallback(async (date) => {
    if (!quadra?.id) return;
    setLoading(true);
    setSelectedSlot(null);
    try {
      const response = await listQuadrasComHorariosDisponiveis({ quadraId: quadra.id, data: date });
      const resultado = Array.isArray(response.data) ? response.data[0] : null;
      setHorarios(resultado?.horariosDisponiveis ?? []);
    } catch (e) {
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, [quadra?.id]);

  useEffect(() => {
    fetchHorarios(selectedDate);
  }, [selectedDate, fetchHorarios]);

  // Ação de Reserva
  async function handleReservar() {
    if (!selectedSlot) return;
    setReservando(true);
    try {
      await createReserva({
        quadraId: quadra.id,
        dataInicio: `${selectedDate}T${selectedSlot.inicio}:00`,
        dataFim: `${selectedDate}T${selectedSlot.fim}:00`,
      });
      Alert.alert('Sucesso', 'Reserva realizada com sucesso!');
      fetchHorarios(selectedDate);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Erro ao reservar.');
    } finally {
      setReservando(false);
    }
  }
  const calendarTheme = {
    selectedDayBackgroundColor: COLORS.primary,
    selectedDayTextColor: '#ffffff',
    todayTextColor: COLORS.primary,
    dayTextColor: COLORS.textMain,
    textDisabledColor: '#d9e1e8',
    dotColor: COLORS.primary,
    arrowColor: COLORS.primary,
    monthTextColor: COLORS.textMain,
    textDayFontWeight: '600',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '500',
    textMonthFontSize: 16,
    'stylesheet.day.basic': {
      selected: {
        backgroundColor: COLORS.primary,
        borderRadius: 17,
      },
      today: {
        borderRadius: 17,
      },
      text: {
        marginTop: 0,
      }
    },
    'stylesheet.day.basic': {
      selected: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
      }
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={(date) => setSelectedDate(date)}
      >
        {/* Calendário no topo, largura total */}
        <View
          style={styles.calendarWrapper}
          onLayout={() => setLayoutReady(true)}
        >
          {layoutReady && (
            <ExpandableCalendar
              firstDay={1}
              initialPosition={ExpandableCalendar.positions.CLOSED}
              theme={calendarTheme}
              allowShadow={false}
              hideKnob={false}
            />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          <Text style={styles.sectionTitle}>Horários Disponíveis</Text>

          {/* Grade de Horários */}
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : horarios.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum horário disponível</Text>
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

          <View style={styles.sectionSeparator} />

          {/* Informações da Quadra */}
          <View style={styles.serviceCard}>
            <Text style={styles.serviceName}>Valor total</Text>
            <Text style={styles.servicePrice}>
              <Text style={styles.priceGreen}>
                {Number(quadra?.valorPorHora || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text> / Hora
            </Text>
          </View>

          {/* Botão de Confirmação */}
          <TouchableOpacity
            style={[styles.mainButton, (!selectedSlot || reservando) && styles.mainButtonDisabled]}
            disabled={!selectedSlot || reservando}
            onPress={handleReservar}
          >
            {reservando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.mainButtonText}>Confirmar</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </CalendarProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
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
  sectionSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 24,
    marginBottom: 16,
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
  calendarWrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    minHeight: 140,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.textMain,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  timeSlot: {
    width: '48%',
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
  textWhite: {
    color: '#FFF',
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
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSub,
  }
});