import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

function formatHora(isoString) {
  if (!isoString) return '--:--';
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ReservaDetailsModal({ visible, reserva, onClose, onCancel }) {
  const inicio = reserva?.periodo?.dataInicio ?? reserva?.dataInicio;
  const fim = reserva?.periodo?.dataFim ?? reserva?.dataFim;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalhes da Reserva</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cliente</Text>
            <Text style={styles.detailValue}>{reserva?.locatario?.nome ?? reserva?.locatarioNome}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Telefone</Text>
            <Text style={styles.detailValue}>{reserva?.locatario?.telefone ?? reserva?.locatarioTelefone ?? '—'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quadra</Text>
            <Text style={styles.detailValue}>{reserva?.quadra?.nome ?? reserva?.quadraNome}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Horário</Text>
            <Text style={styles.detailValue}>{formatHora(inicio)} – {formatHora(fim)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valor Total</Text>
            <Text style={styles.detailValue}>R$ {Number(reserva?.valorTotal ?? reserva?.valor ?? 0).toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{reserva?.status}</Text>
          </View>

          {reserva?.codigoSeguranca && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Código do agendamento</Text>
              <Text style={[styles.detailValue, styles.codeValue]}>{reserva.codigoSeguranca}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity style={[styles.modalButton, styles.cancelActionBtn]} onPress={() => onCancel(reserva?.id)}>
                <Text style={styles.buttonTextWhite}>Cancelar Reserva</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSub,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.textMain,
    fontWeight: '500',
  },
  codeValue: {
    fontWeight: 'bold',
    letterSpacing: 2,
    color: COLORS.primary,
  },
  buttonContainer: {
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelActionBtn: {
    backgroundColor: '#FF4444',
  },
  buttonTextWhite: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonText: {
    color: COLORS.textMain,
    fontWeight: '600',
  },
});
