import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { filtrarQuadras, getQuadraImageUri } from "../../services/quadraService";

const ESPORTES = ["Futebol", "Tênis", "Vôlei", "Beach Tennis", "Basquete", "Futsal"];
const HORARIOS = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

function formatAddress(quadra) {
  const parts = [quadra.endereco, quadra.cidade, quadra.estado].filter(Boolean);
  return parts.join(", ") || "Endereço não informado";
}

function formatDetails(quadra) {
  const parts = [quadra.esporte, quadra.valorPorHora ? `R$ ${quadra.valorPorHora}/h` : null].filter(Boolean);
  return parts.join(" - ") || "";
}

function formatDateLabel(iso) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export default function SearchResult() {
  const navigation = useNavigation();
  const [quadras, setQuadras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filtroEsporte, setFiltroEsporte] = useState(null);
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroData, setFiltroData] = useState(null);
  const [filtroHorario, setFiltroHorario] = useState(null);
  const [modalEsporte, setModalEsporte] = useState(false);
  const [modalCidade, setModalCidade] = useState(false);
  const [modalData, setModalData] = useState(false);
  const [modalHorario, setModalHorario] = useState(false);
  const [cidadeInput, setCidadeInput] = useState("");

  useEffect(() => {
    async function fetchQuadras() {
      setLoading(true);
      setErro(null);
      try {
        let dataInicio;
        let dataFim;

        if (filtroData && filtroHorario) {
          const [h, m] = filtroHorario.split(":");
          const inicio = new Date(`${filtroData}T${filtroHorario}:00`);
          const fim = new Date(inicio);
          fim.setHours(fim.getHours() + 1);
          dataInicio = inicio.toISOString();
          dataFim = fim.toISOString();
        } else if (filtroData) {
          dataInicio = `${filtroData}T00:00:00`;
          dataFim = `${filtroData}T23:59:59`;
        }

        const response = await filtrarQuadras({
          esporte: filtroEsporte ?? undefined,
          localizacao: filtroCidade || undefined,
          dataInicio,
          dataFim,
        });
        const data = response.data;
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.quadras)
          ? data.quadras
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setQuadras(lista);
      } catch (e) {
        setErro(e.message || "Erro ao carregar quadras");
      } finally {
        setLoading(false);
      }
    }
    fetchQuadras();
  }, [filtroEsporte, filtroCidade, filtroData, filtroHorario]);

  const displayedQuadras = useMemo(() => {
    if (!searchText.trim()) return quadras;
    const lower = searchText.toLowerCase();
    return quadras.filter(
      (q) =>
        q.nome?.toLowerCase().includes(lower) ||
        q.cidade?.toLowerCase().includes(lower) ||
        q.esporte?.toLowerCase().includes(lower),
    );
  }, [quadras, searchText]);

  function openModalCidade() {
    setCidadeInput(filtroCidade);
    setModalCidade(true);
  }

  function handleApplyCidade() {
    setFiltroCidade(cidadeInput.trim());
    setModalCidade(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSub} />
          <TextInput
            placeholder="Pesquise aqui"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSub} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            <TouchableOpacity
              style={[styles.filterItem, filtroEsporte && styles.filterItemActive]}
              onPress={() => {
                if (filtroEsporte) setFiltroEsporte(null);
                else setModalEsporte(true);
              }}
            >
              <Ionicons name="football-outline" size={16} color={filtroEsporte ? "#FFF" : COLORS.textMain} />
              <Text style={[styles.filterText, filtroEsporte && styles.filterTextActive]}>
                {filtroEsporte ?? "Esporte"}
              </Text>
              {filtroEsporte && <Ionicons name="close" size={14} color="#FFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterItem, filtroCidade && styles.filterItemActive]}
              onPress={() => {
                if (filtroCidade) { setFiltroCidade(""); setCidadeInput(""); }
                else openModalCidade();
              }}
            >
              <Ionicons name="location-sharp" size={16} color={filtroCidade ? "#FFF" : COLORS.textMain} />
              <Text style={[styles.filterText, filtroCidade && styles.filterTextActive]}>
                {filtroCidade || "Cidade"}
              </Text>
              {filtroCidade && <Ionicons name="close" size={14} color="#FFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterItem, filtroData && styles.filterItemActive]}
              onPress={() => {
                if (filtroData) setFiltroData(null);
                else setModalData(true);
              }}
            >
              <Ionicons name="calendar-outline" size={16} color={filtroData ? "#FFF" : COLORS.textMain} />
              <Text style={[styles.filterText, filtroData && styles.filterTextActive]}>
                {filtroData ? formatDateLabel(filtroData) : "Data"}
              </Text>
              {filtroData && <Ionicons name="close" size={14} color="#FFF" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterItem, filtroHorario && styles.filterItemActive]}
              onPress={() => {
                if (filtroHorario) setFiltroHorario(null);
                else setModalHorario(true);
              }}
            >
              <Ionicons name="time-outline" size={16} color={filtroHorario ? "#FFF" : COLORS.textMain} />
              <Text style={[styles.filterText, filtroHorario && styles.filterTextActive]}>
                {filtroHorario ?? "Horário"}
              </Text>
              {filtroHorario && <Ionicons name="close" size={14} color="#FFF" />}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : erro ? (
          <Text style={styles.erroText}>{erro}</Text>
        ) : (
          <FlatList
            data={displayedQuadras}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultCard}
                onPress={() =>
                  navigation.navigate("QuadraDetails", {
                    quadra: item,
                    dataPreSelecionada: filtroData,
                    horarioPreSelecionado: filtroHorario,
                  })
                }
              >
                <Image
                  source={getQuadraImageUri(item) ? { uri: getQuadraImageUri(item) } : null}
                  style={styles.resultImage}
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.nome}</Text>
                  <Text style={styles.resultAddress}>{formatAddress(item)}</Text>
                  <View style={styles.cardDivider} />
                  <Text style={styles.resultDetails}>{formatDetails(item)}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma quadra encontrada</Text>
            }
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Modal Esporte */}
      <Modal visible={modalEsporte} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setModalEsporte(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o esporte</Text>
            {ESPORTES.map((esporte) => (
              <TouchableOpacity
                key={esporte}
                style={[styles.modalOption, filtroEsporte === esporte && styles.modalOptionActive]}
                onPress={() => { setFiltroEsporte(esporte); setModalEsporte(false); }}
              >
                <Text style={[styles.modalOptionText, filtroEsporte === esporte && styles.modalOptionTextActive]}>
                  {esporte}
                </Text>
                {filtroEsporte === esporte && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal Cidade */}
      <Modal visible={modalCidade} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setModalCidade(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por cidade</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite a cidade..."
              placeholderTextColor={COLORS.textSub}
              value={cidadeInput}
              onChangeText={setCidadeInput}
              autoFocus
              onSubmitEditing={handleApplyCidade}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyCidade}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Data */}
      <Modal visible={modalData} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setModalData(false)} />
          <View style={[styles.modalContent, styles.modalContentWide]}>
            <Text style={styles.modalTitle}>Selecione a data</Text>
            <Calendar
              current={filtroData ?? undefined}
              onDayPress={(day) => { setFiltroData(day.dateString); setModalData(false); }}
              markedDates={filtroData ? { [filtroData]: { selected: true, selectedColor: COLORS.primary } } : {}}
              minDate={new Date().toISOString().slice(0, 10)}
              theme={{
                todayTextColor: COLORS.primary,
                arrowColor: COLORS.primary,
                selectedDayBackgroundColor: COLORS.primary,
                textDayFontWeight: "500",
                textMonthFontWeight: "bold",
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Horário */}
      <Modal visible={modalHorario} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setModalHorario(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o horário</Text>
            <ScrollView style={styles.horarioScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.horarioGrid}>
                {HORARIOS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.horarioItem, filtroHorario === h && styles.horarioItemActive]}
                    onPress={() => { setFiltroHorario(h); setModalHorario(false); }}
                  >
                    <Text style={[styles.horarioText, filtroHorario === h && styles.horarioTextActive]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 75,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 15,
    marginTop: 10,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#FFF",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  erroText: {
    flex: 1,
    textAlign: "center",
    marginTop: 40,
    color: COLORS.textSub,
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.textSub,
    fontSize: 14,
  },
  listPadding: {
    padding: 20,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    overflow: "hidden",
    height: 100,
  },
  resultImage: {
    width: 100,
    height: "100%",
    backgroundColor: "#EEE",
  },
  resultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textMain,
  },
  resultAddress: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  resultDetails: {
    fontSize: 11,
    color: COLORS.textSub,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalContentWide: {
    width: "92%",
    padding: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textMain,
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionActive: {
    backgroundColor: `${COLORS.primary}15`,
  },
  modalOptionText: {
    fontSize: 15,
    color: COLORS.textMain,
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textMain,
    marginBottom: 12,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  horarioScroll: {
    maxHeight: 220,
  },
  horarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  horarioItem: {
    width: "28%",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  horarioItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  horarioText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMain,
  },
  horarioTextActive: {
    color: "#FFF",
  },
});
