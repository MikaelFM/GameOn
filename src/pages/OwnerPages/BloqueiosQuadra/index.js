import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { COLORS } from "../../../constants/colors";
import {
  listarBloqueiosPorQuadra,
  criarBloqueioQuadra,
  deletarBloqueioQuadra,
} from "../../../services/bloqueioQuadraService";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function formatDate(date) {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
}

function formatDateDisplay(date) {
  if (!date) return null;
  return format(date, "dd/MM/yyyy");
}

export default function BloqueiosQuadra() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quadra } = route.params;

  const [bloqueios, setBloqueios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [dateInicio, setDateInicio] = useState(null);
  const [dateFim, setDateFim] = useState(null);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("18:00");
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // iOS only — which picker is open
  const [iosPickerTarget, setIosPickerTarget] = useState(null);

  useFocusEffect(
    useCallback(() => {
      carregarBloqueios();
    }, [quadra.id])
  );

  async function carregarBloqueios() {
    setLoading(true);
    try {
      const res = await listarBloqueiosPorQuadra(quadra.id);
      const data = res.data;
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.bloqueios)
        ? data.bloqueios
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setBloqueios(lista);
    } catch {
      setBloqueios([]);
    } finally {
      setLoading(false);
    }
  }

  function abrirModal() {
    setDateInicio(null);
    setDateFim(null);
    setHoraInicio("08:00");
    setHoraFim("18:00");
    setMotivo("");
    setIosPickerTarget(null);
    setModalVisible(true);
  }

  function applyDate(target, date) {
    if (target === "inicio") {
      setDateInicio(date);
      if (dateFim && date > dateFim) setDateFim(null);
    } else {
      setDateFim(date);
    }
  }

  function openDatePicker(target) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current =
      target === "inicio"
        ? dateInicio ?? today
        : dateFim ?? dateInicio ?? today;

    const minimum = target === "fim" && dateInicio ? dateInicio : today;

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: current,
        minimumDate: minimum,
        mode: "date",
        accentColor: COLORS.primary,
        onChange: (event, date) => {
          if (event.type === "set" && date) applyDate(target, date);
        },
      });
    } else {
      setIosPickerTarget(target);
    }
  }

  async function confirmarBloqueio() {
    if (!dateInicio || !dateFim) {
      Alert.alert("Atenção", "Informe as datas de início e fim.");
      return;
    }
    if (!motivo.trim()) {
      Alert.alert("Atenção", "Informe o motivo do bloqueio.");
      return;
    }
    if (!TIME_REGEX.test(horaInicio) || !TIME_REGEX.test(horaFim)) {
      Alert.alert("Atenção", "Informe horários válidos no formato HH:MM.");
      return;
    }
    const [hI, mI] = horaInicio.split(":").map(Number);
    const [hF, mF] = horaFim.split(":").map(Number);
    const mesmaData = formatDate(dateInicio) === formatDate(dateFim);
    if (mesmaData && hI * 60 + mI >= hF * 60 + mF) {
      Alert.alert("Atenção", "Na mesma data, o horário de início deve ser anterior ao de fim.");
      return;
    }

    setSubmitting(true);
    try {
      await criarBloqueioQuadra({
        quadraId: quadra.id,
        dataInicio: new Date(`${formatDate(dateInicio)}T${horaInicio}:00`).toISOString(),
        dataFim: new Date(`${formatDate(dateFim)}T${horaFim}:00`).toISOString(),
        motivo: motivo.trim(),
      });
      setModalVisible(false);
      carregarBloqueios();
    } catch (error) {
      Alert.alert("Erro", error.message || "Não foi possível criar o bloqueio.");
    } finally {
      setSubmitting(false);
    }
  }

  function confirmarExclusao(bloqueio) {
    Alert.alert("Remover bloqueio", "Deseja remover este bloqueio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarBloqueioQuadra(bloqueio.id);
            setBloqueios((prev) => prev.filter((b) => b.id !== bloqueio.id));
          } catch (error) {
            Alert.alert("Erro", error.message || "Não foi possível remover o bloqueio.");
          }
        },
      },
    ]);
  }

  function formatarData(isoStr) {
    try { return format(parseISO(isoStr), "dd/MM/yyyy"); }
    catch { return "--"; }
  }

  function formatarHora(isoStr) {
    try {
      const d = new Date(isoStr);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    } catch { return "--"; }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color={COLORS.textMain} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Bloqueios</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{quadra.nome}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : bloqueios.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="lock" size={44} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhum bloqueio cadastrado</Text>
            <Text style={styles.emptySubText}>
              Adicione bloqueios para impedir reservas em horários específicos.
            </Text>
          </View>
        ) : (
          bloqueios.map((bloqueio) => (
            <View key={String(bloqueio.id)} style={styles.bloqueioCard}>
              <View style={styles.lockBadge}>
                <Feather name="lock" size={16} color="#B42318" />
              </View>
              <View style={styles.bloqueioInfo}>
                <Text style={styles.bloqueioData}>
                  {formatarData(bloqueio.dataInicio)}
                  {formatarData(bloqueio.dataInicio) !== formatarData(bloqueio.dataFim)
                    ? ` → ${formatarData(bloqueio.dataFim)}`
                    : ""}
                </Text>
                <Text style={styles.bloqueioHorario}>
                  {formatarHora(bloqueio.dataInicio)} – {formatarHora(bloqueio.dataFim)}
                </Text>
                <Text style={styles.bloqueioMotivo} numberOfLines={2}>{bloqueio.motivo}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmarExclusao(bloqueio)}
              >
                <Feather name="trash-2" size={16} color="#B42318" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Novo bloqueio modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo bloqueio</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={12}>
                <Feather name="x" size={22} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

              {/* Date row */}
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.formLabel}>Data inicial</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => openDatePicker("inicio")}
                    activeOpacity={0.7}
                  >
                    <Feather name="calendar" size={15} color={dateInicio ? COLORS.primary : COLORS.border} />
                    <Text style={[styles.dateInputText, !dateInicio && styles.dateInputPlaceholder]}>
                      {dateInicio ? formatDateDisplay(dateInicio) : "dd/mm/aaaa"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateSeparator}>
                  <Feather name="arrow-right" size={16} color={COLORS.border} />
                </View>

                <View style={styles.dateField}>
                  <Text style={styles.formLabel}>Data final</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => openDatePicker("fim")}
                    activeOpacity={0.7}
                  >
                    <Feather name="calendar" size={15} color={dateFim ? COLORS.primary : COLORS.border} />
                    <Text style={[styles.dateInputText, !dateFim && styles.dateInputPlaceholder]}>
                      {dateFim ? formatDateDisplay(dateFim) : "dd/mm/aaaa"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* iOS inline pickers */}
              {Platform.OS === "ios" && iosPickerTarget !== null && (
                <View style={styles.iosPickerContainer}>
                  <DateTimePicker
                    value={
                      iosPickerTarget === "inicio"
                        ? dateInicio ?? new Date()
                        : dateFim ?? dateInicio ?? new Date()
                    }
                    mode="date"
                    display="spinner"
                    minimumDate={
                      iosPickerTarget === "fim" && dateInicio ? dateInicio : new Date()
                    }
                    accentColor={COLORS.primary}
                    onChange={(event, date) => {
                      if (date) applyDate(iosPickerTarget, date);
                    }}
                    locale="pt-BR"
                  />
                  <TouchableOpacity
                    style={styles.iosPickerDone}
                    onPress={() => setIosPickerTarget(null)}
                  >
                    <Text style={styles.iosPickerDoneText}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Time row */}
              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <Text style={styles.formLabel}>Hora inicial</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={horaInicio}
                    onChangeText={setHoraInicio}
                    placeholder="08:00"
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                  />
                </View>
                <View style={styles.timeSep}>
                  <Text style={styles.timeSepText}>até</Text>
                </View>
                <View style={styles.timeField}>
                  <Text style={styles.formLabel}>Hora final</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={horaFim}
                    onChangeText={setHoraFim}
                    placeholder="18:00"
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                  />
                </View>
              </View>

              <Text style={styles.formLabel}>Motivo</Text>
              <TextInput
                style={styles.motivoInput}
                value={motivo}
                onChangeText={setMotivo}
                placeholder="Ex: Manutenção, evento privado..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.actionButton, submitting && styles.actionButtonDisabled]}
                onPress={confirmarBloqueio}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.actionButtonText}>Confirmar bloqueio</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textMain, lineHeight: 22 },
  headerSubtitle: { fontSize: 13, color: COLORS.textSub, marginTop: 1 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { fontSize: 13, fontWeight: "600", color: "#fff" },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 8 },
  emptyContainer: { alignItems: "center", marginTop: 60, gap: 10, paddingHorizontal: 20 },
  emptyText: { fontSize: 16, fontWeight: "600", color: COLORS.textMain, marginTop: 8 },
  emptySubText: { fontSize: 13, color: COLORS.textSub, textAlign: "center", lineHeight: 20 },
  bloqueioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  lockBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(180,35,24,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bloqueioInfo: { flex: 1, gap: 2 },
  bloqueioData: { fontSize: 14, fontWeight: "700", color: COLORS.textMain },
  bloqueioHorario: { fontSize: 13, color: COLORS.textSub },
  bloqueioMotivo: { fontSize: 12, color: COLORS.textSub, fontStyle: "italic", marginTop: 2 },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(180,35,24,0.08)",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  modalTitle: { fontSize: 17, fontWeight: "bold", color: COLORS.textMain },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSub,
    marginBottom: 6,
    marginTop: 16,
  },
  // Date pickers
  dateRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    marginTop: 4,
  },
  dateField: { flex: 1 },
  dateSeparator: {
    paddingBottom: 13,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    backgroundColor: "#fff",
  },
  dateInputText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMain,
    flex: 1,
  },
  dateInputPlaceholder: {
    color: COLORS.border,
    fontWeight: "400",
  },
  // iOS picker
  iosPickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    backgroundColor: "#fff",
  },
  iosPickerDone: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  iosPickerDoneText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  // Time inputs
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  timeField: { flex: 1 },
  timeSep: { paddingBottom: 13 },
  timeSepText: { fontSize: 13, color: COLORS.textSub },
  timeInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textMain,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  motivoInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textMain,
    backgroundColor: "#fff",
    minHeight: 90,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  actionButtonDisabled: { opacity: 0.5 },
  actionButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
