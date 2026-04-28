import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors'

const ScheduleCard = ({ item, isCompleted, onCancel, cancelling, onDetails }) => {
  function handleCancel() {
    Alert.alert(
      'Cancelar reserva',
      `Deseja cancelar a reserva de ${item.courtName}?`,
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim, cancelar', style: 'destructive', onPress: () => onCancel?.(item.id) },
      ]
    );
  }

  const statusLabel = isCompleted ? 'Finalizado' : (item.status === 'AGUARDANDO_APROVACAO' ? 'Aguardando' : 'Confirmado');
  let badgeBg = '#E8F5E9';
  let badgeColor = COLORS.primary;
  if (isCompleted) {
    badgeBg = '#F1F1F1';
    badgeColor = '#666';
  } else if (item.status === 'AGUARDANDO_APROVACAO') {
    badgeBg = '#FFF4E5';
    badgeColor = '#FB8C00';
  }

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
          { backgroundColor: badgeBg }
        ]}>
          <Text style={[
            styles.statusText,
            { color: badgeColor }
          ]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.courtName}>{item.courtName}</Text>
      <Text style={styles.location}>{item.location}</Text>

      {item.codigoSeguranca && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Código do agendamento</Text>
          <Text style={styles.codeValue}>{item.codigoSeguranca}</Text>
        </View>
      )}

      {!isCompleted && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling
              ? <ActivityIndicator size="small" color="#E57373" />
              : <Text style={styles.cancelText}>Cancelar</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton} onPress={() => onDetails?.(item.raw ?? item)}>
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
  codeContainer: {
    marginTop: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeLabel: {
    fontSize: 11,
    color: COLORS.textSub,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textMain,
    letterSpacing: 2,
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
  cancelButtonDisabled: {
    opacity: 0.6,
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