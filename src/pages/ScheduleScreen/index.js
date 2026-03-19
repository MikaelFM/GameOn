import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 20;
const VISIBLE_WIDTH = width - (CONTAINER_PADDING * 2);
const COLUMN_WIDTH = VISIBLE_WIDTH / 7;

const WEEK_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('09');
  const [selectedTime, setSelectedTime] = useState('17:00');

  const WEEKS = [
    { id: 'w1', days: ['09', '10', '11', '12', '13', '14', '15'] },
    { id: 'w2', days: ['16', '17', '18', '19', '20', '21', '22'] },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>Quadra Poliesportiva</Text>
          <Text style={styles.servicePrice}>
            <Text style={styles.priceGreen}>R$ 120,00</Text> / Hora
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.monthText}>Março</Text>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textMain} />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.fixedWeekHeader}>
            {WEEK_NAMES.map((name, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.weekLabel}>{name}</Text>
              </View>
            ))}
          </View>

          <FlatList
            data={WEEKS}
            renderItem={({ item }) => (
              <View style={styles.weekPage}>
                {item.days.map((dayNumber, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => setSelectedDate(dayNumber)}
                    style={styles.dayColumn}
                  >
                    <View style={[
                      styles.dateCircle, 
                      selectedDate === dayNumber && styles.dateCircleActive
                    ]}>
                      <Text style={[
                        styles.dayNumberText, 
                        selectedDate === dayNumber && styles.textWhite
                      ]}>
                        {dayNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={VISIBLE_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true}
          />
        </View>

        <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
        <View style={styles.timesGrid}>
          {['10:00', '11:00', '13:00', '15:00', '17:00', '20:00', '21:00'].map((time) => (
            <TouchableOpacity 
              key={time} 
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeSlot, 
                selectedTime === time && styles.timeSlotSelected
              ]}
            >
              <Text style={[
                styles.timeText, 
                selectedTime === time && styles.textWhite
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Confirmar</Text>
        </TouchableOpacity>

      </View>
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
    flex: 1,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    gap: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  fixedWeekHeader: {
    flexDirection: 'row',
    width: VISIBLE_WIDTH,
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  weekLabel: {
    fontSize: 13,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  weekPage: {
    flexDirection: 'row',
    width: VISIBLE_WIDTH,
    justifyContent: 'space-around',
  },
  dayColumn: {
    alignItems: 'center',
    width: COLUMN_WIDTH,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  dateCircleActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  dayNumberText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  textWhite: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  timeSlot: {
    width: '30%',
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
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  mainButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});