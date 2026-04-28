import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../../constants/colors";
import { AuthContext } from "../../../contexts/AuthContext";
import {
    bloquearLocatario,
    desbloquearLocatario,
    getBloqueiosLocador,
    getClientesByLocador,
    getHistoricoLocador,
    updateReservaStatus,
} from "../../../services/reservaService";
import { filtrarQuadras } from "../../../services/quadraService";

const TAB_CLIENTES = "clientes";
const TAB_APROVACAO = "aprovacoes";

function normalizarLista(valor) {
    if (Array.isArray(valor)) return valor;
    return [];
}

function formatarPeriodoReserva(dataInicioStr, dataFimStr) {
    if (!dataInicioStr || !dataFimStr) return "--/--/---- --h às --h";
    
    const dIni = new Date(dataInicioStr);
    const dFim = new Date(dataFimStr);

    if (isNaN(dIni.getTime()) || isNaN(dFim.getTime())) return "--/--/---- --h às --h";

    const dia = String(dIni.getDate()).padStart(2, "0");
    const mes = String(dIni.getMonth() + 1).padStart(2, "0");
    const ano = dIni.getFullYear();
    
    const horaIni = String(dIni.getHours()).padStart(2, "0");
    const horaFim = String(dFim.getHours()).padStart(2, "0");

    return `${dia}/${mes}/${ano} - ${horaIni}h às ${horaFim}h`;
}

export default function ClientList() {
    const { user } = useContext(AuthContext);
    const [clientes, setClientes] = useState([]);
    const [bloqueios, setBloqueios] = useState([]);
    const [reservasPendentes, setReservasPendentes] = useState([]);
    const [quadrasComAprovacao, setQuadrasComAprovacao] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(TAB_CLIENTES);

    const avatarGenerico = "https://avatar.iran.liara.run/public/boy?username=User";

    const approvalEnabled = quadrasComAprovacao.length > 0;

    const bloqueiosMap = useMemo(() => {
        return new Set(
            bloqueios
                .map((bloqueio) => bloqueio?.locatario?.id ?? bloqueio?.locatarioId)
                .filter((id) => id !== undefined && id !== null)
                .map((id) => Number(id)),
        );
    }, [bloqueios]);

    const pedidosAprovacao = useMemo(() => {
        const quadrasPermitidas = new Set(quadrasComAprovacao.map((quadra) => Number(quadra.id)));
        return reservasPendentes.filter((reserva) => {
            const quadraId = Number(reserva?.quadra?.id ?? reserva?.quadraId);
            return reserva?.status === "AGUARDANDO_APROVACAO" && quadrasPermitidas.has(quadraId);
        });
    }, [quadrasComAprovacao, reservasPendentes]);

    const clientesFiltrados = useMemo(() => {
        const termo = searchText.trim().toLowerCase();
        return clientes.filter((cliente) => {
            if (!termo) return true;
            return [cliente?.nome, cliente?.email].some((valor) =>
                String(valor ?? "").toLowerCase().includes(termo),
            );
        });
    }, [searchText, clientes]);

    const pedidosFiltrados = useMemo(() => {
        const termo = searchText.trim().toLowerCase();
        return pedidosAprovacao.filter((reserva) => {
            if (!termo) return true;
            return [
                reserva?.locatario?.nome,
                reserva?.locatario?.email,
                reserva?.quadra?.nome,
                reserva?.status,
            ].some((valor) => String(valor ?? "").toLowerCase().includes(termo));
        });
    }, [pedidosAprovacao, searchText]);

    const carregarDados = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const [clientesRes, bloqueiosRes, historicoRes, quadrasRes] = await Promise.allSettled([
                getClientesByLocador(user.id),
                getBloqueiosLocador(),
                getHistoricoLocador(),
                filtrarQuadras({ locadorId: user.id }),
            ]);

            setClientes(normalizarLista(clientesRes.status === "fulfilled" ? clientesRes.value?.data?.clientes ?? clientesRes.value?.data : []));
            setBloqueios(normalizarLista(bloqueiosRes.status === "fulfilled" ? bloqueiosRes.value?.data?.bloqueios : []));
            setReservasPendentes(normalizarLista(historicoRes.status === "fulfilled" ? historicoRes.value?.data?.historico : []));
            setQuadrasComAprovacao(
                normalizarLista(quadrasRes.status === "fulfilled" ? quadrasRes.value?.data?.quadras ?? quadrasRes.value?.data : []).filter(
                    (quadra) => quadra?.requerAprovacao,
                ),
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível carregar os dados.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados]),
    );

    const handleBlockClient = (cliente) => {
        const bloqueado = bloqueiosMap.has(Number(cliente?.id));
        const acao = bloqueado ? "desbloquear" : "bloquear";
        Alert.alert(
            bloqueado ? "Desbloquear locatário" : "Bloquear locatário",
            bloqueado ? `Deseja remover o bloqueio de ${cliente?.nome}?` : `Bloquear ${cliente?.nome} impedirá novos agendamentos.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: bloqueado ? "Desbloquear" : "Bloquear",
                    style: bloqueado ? "default" : "destructive",
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            if (bloqueado) await desbloquearLocatario(cliente.id);
                            else await bloquearLocatario(cliente.id);
                            await carregarDados();
                        } catch (error) {
                            Alert.alert("Erro", error?.message || `Erro ao ${acao}.`);
                        } finally {
                            setActionLoading(false);
                        }
                    },
                },
            ],
        );
    };

    const handleDecisaoReserva = (reserva, status) => {
        const aprovar = status === "RESERVADO";
        Alert.alert(
            aprovar ? "Aprovar agendamento" : "Rejeitar agendamento",
            aprovar ? `Aprovar o agendamento de ${reserva?.locatario?.nome}?` : `Rejeitar o agendamento de ${reserva?.locatario?.nome}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: aprovar ? "Aprovar" : "Rejeitar",
                    style: aprovar ? "default" : "destructive",
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await updateReservaStatus(reserva.id, status);
                            await carregarDados();
                        } catch (error) {
                            Alert.alert("Erro", "Erro ao atualizar agendamento.");
                        } finally {
                            setActionLoading(false);
                        }
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Clientes</Text>
                <View style={styles.headerLine} />
            </View>

            <View style={styles.container}>
                <View style={styles.searchSection}>
                    <Ionicons name="search-outline" size={20} color={COLORS.textSub} style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar por nome ou e-mail..."
                        placeholderTextColor={COLORS.textSub}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View style={styles.tabsRow}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === TAB_CLIENTES && styles.tabButtonActive]}
                        onPress={() => setActiveTab(TAB_CLIENTES)}
                    >
                        <Text style={[styles.tabText, activeTab === TAB_CLIENTES && styles.tabTextActive]}>
                            Clientes ({clientesFiltrados.length})
                        </Text>
                    </TouchableOpacity>

                    {approvalEnabled && (
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === TAB_APROVACAO && styles.tabButtonActive]}
                            onPress={() => setActiveTab(TAB_APROVACAO)}
                        >
                            <Text style={[styles.tabText, activeTab === TAB_APROVACAO && styles.tabTextActive]}>
                                Solic. de Reserva ({pedidosFiltrados.length})
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={activeTab === TAB_APROVACAO && approvalEnabled ? pedidosFiltrados : clientesFiltrados}
                        keyExtractor={(item, index) => String(item.id ?? index)}
                        renderItem={({ item }) => (
                            activeTab === TAB_APROVACAO && approvalEnabled ? (
                                <View style={styles.approvalCard}>
                                    <View style={styles.clientInfo}>
                                        <Image source={{ uri: avatarGenerico }} style={styles.avatar} />
                                        <View style={styles.textContainer}>
                                            <Text style={styles.clientName}>{item.locatario?.nome}</Text>
                                            <Text style={styles.clientEmail}>{item.locatario?.email}</Text>
                                            <Text style={styles.approvalMeta}>{item.quadra?.nome}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.timeHighlightContainer}>
                                        <Ionicons name="calendar-outline" size={16} color="#666" />
                                        <Text style={styles.approvalPeriod}>
                                            {formatarPeriodoReserva(item?.dataInicio, item?.dataFim)}
                                        </Text>
                                    </View>

                                    <View style={styles.approvalActions}>
                                        <TouchableOpacity
                                            style={[styles.approvalButton, styles.rejectButton]}
                                            onPress={() => handleDecisaoReserva(item, "CANCELADO")}
                                            disabled={actionLoading}
                                        >
                                            <Ionicons name="close-outline" size={18} color="#B42318" />
                                            <Text style={styles.rejectButtonText}>Rejeitar</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.approvalButton, styles.approveButton]}
                                            onPress={() => handleDecisaoReserva(item, "RESERVADO")}
                                            disabled={actionLoading}
                                        >
                                            <Ionicons name="checkmark-outline" size={18} color="#2B9D48" />
                                            <Text style={styles.approveButtonText}>Aprovar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.clientCard}>
                                    <View style={styles.clientInfo}>
                                        <Image source={{ uri: avatarGenerico }} style={styles.avatar} />
                                        <View style={styles.textContainer}>
                                            <View style={styles.nameRow}>
                                                <Text style={styles.clientName}>{item.nome}</Text>
                                                {bloqueiosMap.has(Number(item.id)) && (
                                                    <View style={styles.blockedBadge}>
                                                        <Text style={styles.blockedBadgeText}>Bloqueado</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.clientEmail}>{item.email}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.blockButton, bloqueiosMap.has(Number(item.id)) && styles.unblockButton]}
                                        onPress={() => handleBlockClient(item)}
                                        disabled={actionLoading}
                                    >
                                        <Ionicons
                                            name={bloqueiosMap.has(Number(item.id)) ? "refresh-outline" : "ban-outline"}
                                            size={20}
                                            color={bloqueiosMap.has(Number(item.id)) ? COLORS.primary : "#FF4444"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        )}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                {activeTab === TAB_APROVACAO ? "Sem agendamentos pendentes." : "Nenhum cliente encontrado."}
                            </Text>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerContainer: {
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.textMain,
        textAlign: "center",
    },
    headerLine: {
        height: 1,
        backgroundColor: COLORS.border,
        marginTop: 15,
        width: "100%",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    searchSection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 25,
        height: 50,
    },
    tabsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 14,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: "#EDF2EE",
    },
    tabButtonActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSub,
    },
    tabTextActive: {
        color: "#fff",
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textMain,
    },
    clientCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    approvalCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        marginBottom: 12,
    },
    clientInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#DDD",
    },
    textContainer: {
        marginLeft: 15,
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    clientName: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.textMain,
    },
    clientEmail: {
        fontSize: 13,
        color: COLORS.textSub,
        marginTop: 2,
    },
    blockedBadge: {
        backgroundColor: "#FFF1F1",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
    },
    blockedBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#D92D20",
    },
    blockButton: {
        padding: 10,
        backgroundColor: "#FFF1F1",
        borderRadius: 10,
        marginLeft: 10,
    },
    unblockButton: {
        backgroundColor: "rgba(43,157,72,0.12)",
    },
    approvalMeta: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: "600",
        marginTop: 4,
    },
    timeHighlightContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    approvalPeriod: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    approvalActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14,
    },
    approvalButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
    },
    rejectButton: {
        backgroundColor: "#FFF3F2",
    },
    approveButton: {
        backgroundColor: "rgba(43,157,72,0.12)",
    },
    rejectButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#B42318",
    },
    approveButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: COLORS.textSub,
    },
});