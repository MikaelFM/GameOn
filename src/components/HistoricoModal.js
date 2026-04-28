import React, { useContext, useState, useCallback } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { COLORS } from "../constants/colors";
import { AuthContext } from "../contexts/AuthContext";
import { getHistoricoLocador, getHistoricoLocatario } from "../services/reservaService";

const STATUS_CONFIG = {
  RESERVADO:             { label: "Confirmado",  color: COLORS.primary },
  AGUARDANDO_APROVACAO:  { label: "Pendente",    color: "#D97706" },
  CANCELADO:             { label: "Cancelado",   color: "#B42318" },
  CONCLUIDO:             { label: "Concluído",   color: "#6B7280" },
};

function statusInfo(status) {
  return STATUS_CONFIG[status] ?? { label: status, color: "#6B7280" };
}

function formatData(iso) {
  try { return format(parseISO(iso), "dd/MM/yyyy"); }
  catch { return "--"; }
}

function formatHora(iso) {
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch { return "--"; }
}

export function HistoricoModal({ visible, onClose }) {
  const { user } = useContext(AuthContext);
  const isLocador = user?.tipo === "LOCADOR" || user?.role === "owner";

  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carrega quando o modal abre
  const carregar = useCallback(async () => {
    if (!visible) return;
    setLoading(true);
    try {
      const res = isLocador
        ? await getHistoricoLocador()
        : await getHistoricoLocatario();
      const data = res.data;
      setHistorico(data.historico ?? []);
    } catch {
      setHistorico([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [visible, isLocador]);

  // Dispara ao tornar visível
  React.useEffect(() => { carregar(); }, [carregar]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Histórico de Reservas</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={COLORS.textMain} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {historico.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="calendar" size={44} color={COLORS.border} />
                <Text style={styles.emptyText}>Nenhuma reserva encontrada.</Text>
              </View>
            ) : (
              historico.map((item) => {
                const { label, color } = statusInfo(item.status);
                return (
                  <View key={String(item.id)} style={styles.card}>
                    <View style={styles.cardTop}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.quadraNome} numberOfLines={1}>
                          {item.quadra?.nome ?? "—"}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: color + "1A" }]}>
                          <Text style={[styles.statusText, { color }]}>{label}</Text>
                        </View>
                      </View>

                      {isLocador && (
                        <Text style={styles.clienteNome}>
                          <Feather name="user" size={12} /> {item.locatario?.nome ?? "—"}
                        </Text>
                      )}
                    </View>

                    <View style={styles.cardBottom}>
                      <View style={styles.infoItem}>
                        <Feather name="calendar" size={13} color={COLORS.textSub} />
                        <Text style={styles.infoText}>{formatData(item.dataInicio)}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Feather name="clock" size={13} color={COLORS.textSub} />
                        <Text style={styles.infoText}>
                          {formatHora(item.dataInicio)} – {formatHora(item.dataFim)}
                        </Text>
                      </View>
                      {item.valorTotal != null && (
                        <View style={styles.infoItem}>
                          <Feather name="dollar-sign" size={13} color={COLORS.textSub} />
                          <Text style={styles.infoText}>
                            R$ {Number(item.valorTotal).toFixed(2)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSub,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  cardTop: {
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  quadraNome: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textMain,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  clienteNome: {
    fontSize: 13,
    color: COLORS.textSub,
  },
  cardBottom: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSub,
  },
});
