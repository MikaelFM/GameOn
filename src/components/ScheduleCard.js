import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors'

const ScheduleCard = ({ item, isCompleted }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.infoRow}>
          <Ionicons 
            name="calendar-outline" 
            size={18} 
            color={COLORS.primary} 
          />
          <Text style={styles.dateText}>
            {item.date} - {item.time}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: isCompleted ? '#F1F1F1' : '#E8F5E9' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: isCompleted ? '#666' : COLORS.primary }
          ]}>
            {isCompleted ? 'Finalizado' : 'Confirmado'}
          </Text>
        </View>
      </View>

      <Text style={styles.courtName}>{item.courtName}</Text>
      <Text style={styles.location}>{item.location}</Text>

      {!isCompleted && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  location: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E57373',
  },
  cancelText: {
    color: '#E57373',
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  detailsText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default ScheduleCard;