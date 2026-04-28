import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import { COLORS } from "../../../constants/colors";
import {
    getReservasLocadorDia,
    cancelReserva,
    updateReservaStatus,
} from "../../../services/reservaService";
import ReservaDetailsModal from '../../../components/ReservaDetailsModal';

export default function OwnerCalendar() {
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "yyyy-MM-dd"),
    );
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    function getStatusVisual(status) {
        switch (status) {
            case 'AGUARDANDO_APROVACAO':
                return {
                    icon: 'time-outline',
                    label: 'Pendente de aprovação',
                    color: '#D98C1E',
                };
            case 'RESERVADO':
                return {
                    icon: 'checkmark-circle-outline',
                    label: 'Aprovado',
                    color: COLORS.primary,
                };
            case 'CANCELADO':
                return {
                    icon: 'close-circle-outline',
                    label: 'Reprovado',
                    color: '#B42318',
                };
            default:
                return {
                    icon: 'information-circle-outline',
                    label: status,
                    color: COLORS.textSub,
                };
        }
    }

    useEffect(() => {
        loadReservas();
    }, [selectedDate]);

    async function loadReservas() {
        setLoading(true);
        try {
            const response = await getReservasLocadorDia(selectedDate);
            setReservas(response.data?.reservas ?? []);
        } catch (error) {
            console.error(error);
            setReservas([]);
        } finally {
            setLoading(false);
        }
    }

    function formatHora(isoString) {
        if (!isoString) return "--:--";
        const d = new Date(isoString);
        return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }

    const handleCancel = (id) => {
        Alert.alert("Confirmar", "Você deseja mesmo cancelar esta reserva?", [
            { text: "Não", style: "cancel" },
            {
                text: "Sim",
                style: "destructive",
                onPress: async () => {
                    await cancelReserva(id);
                    setModalVisible(false);
                    loadReservas();
                },
            },
        ]);
    };

    const handleDecisaoReserva = async (reserva, status) => {
        if (!reserva?.id) return;
        const aprovar = status === 'RESERVADO';
        Alert.alert(
            aprovar ? 'Aprovar agendamento' : 'Reprovar agendamento',
            aprovar
                ? `Aprovar o agendamento de ${reserva?.locatario?.nome ?? 'este cliente'}?`
                : `Reprovar o agendamento de ${reserva?.locatario?.nome ?? 'este cliente'}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: aprovar ? 'Aprovar' : 'Reprovar',
                    style: aprovar ? 'default' : 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await updateReservaStatus(reserva.id, status);
                            setModalVisible(false);
                            await loadReservas();
                        } catch (error) {
                            Alert.alert('Erro', error?.message || 'Erro ao atualizar agendamento.');
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
                <Text style={styles.headerTitle}>Calendário</Text>
                <View style={styles.headerLine} />
            </View>

            <View style={styles.container}>
                <View style={styles.calendarCard}>
                    <Calendar
                        current={selectedDate}
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: COLORS.primary },
                        }}
                        theme={{
                            todayTextColor: COLORS.primary,
                            arrowColor: COLORS.primary,
                            selectedDayBackgroundColor: COLORS.primary,
                            textDayFontWeight: "500",
                            textMonthFontWeight: "bold",
                            textDayHeaderFontWeight: "500",
                        }}
                    />
                </View>

                <Text style={styles.title}>Reservas do dia</Text>

                {loading ? (
                    <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    <ScrollView
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {reservas.length > 0 ? (
                            reservas.map((item) => {
                                const statusVisual = getStatusVisual(item.status);
                                return (
                                    <View key={item.id.toString()} style={styles.reservaCard}>
                                        <View style={styles.reservaInfo}>
                                            <View style={styles.pendingRow}>
                                                <Ionicons name={statusVisual.icon} size={16} color={statusVisual.color} />
                                                <Text style={[styles.pendingText, { color: statusVisual.color }]}>{statusVisual.label}</Text>
                                            </View>
                                            <Text style={styles.reservaTime}>
                                                {formatHora(item.periodo?.dataInicio)} - {formatHora(item.periodo?.dataFim)}
                                            </Text>
                                            <Text style={styles.reservaClient}>{item.locatario?.nome}</Text>
                                            <Text style={styles.reservaQuadra}>{item.quadra?.nome}</Text>
                                        </View>

                                        <View style={styles.cardActions}>
                                            <View>
                                            {item.status === 'AGUARDANDO_APROVACAO' ? (
                                                <View style={styles.actionRow}>
                                                    <TouchableOpacity
                                                        style={[styles.actionButton, styles.approveButton]}
                                                        onPress={() => handleDecisaoReserva(item, 'RESERVADO')}
                                                        disabled={actionLoading}
                                                    >
                                                        <Ionicons name="checkmark" size={24} color="#2B9D48" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.actionButton, styles.rejectButton]}
                                                        onPress={() => handleDecisaoReserva(item, 'CANCELADO')}
                                                        disabled={actionLoading}
                                                    >
                                                        <Ionicons name="close" size={24} color="#B42318" />
                                                    </TouchableOpacity>
                                                </View>
                                            ) : null}
                                            </View>
                                            <TouchableOpacity
                                                style={styles.detailsButton}
                                                onPress={() => {
                                                    setSelectedReserva(item);
                                                    setModalVisible(true);
                                                }}
                                            >
                                                <Text style={styles.detailsText}>Detalhes</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.emptyText}>Nenhuma reserva para esta data.</Text>
                        )}
                    </ScrollView>
                )}
            </View>

            <ReservaDetailsModal
                visible={modalVisible}
                reserva={selectedReserva}
                onClose={() => setModalVisible(false)}
                onCancel={(id) => handleCancel(id)}
            />
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
        fontSize: 22,
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
        flex: 1, // Permite que o container principal preencha a tela
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    calendarCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 10,
        marginBottom: 25,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textMain,
        marginBottom: 15,
    },
    list: {
        flex: 1,
        maxHeight: 215
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    reservaCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        marginBottom: 12,
    },
    reservaInfo: {
        flex: 1,
        justifyContent: "center",
    },
    reservaTime: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    reservaClient: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textMain,
        marginTop: 2,
    },
    reservaQuadra: {
        fontSize: 14,
        color: COLORS.textSub,
    },
    pendingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    pendingText: {
        fontSize: 13,
        fontWeight: "700",
    },
    cardActions: {
        paddingLeft: 14,
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    actionRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 10,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    rejectButton: {
        backgroundColor: "#FFF5F5",
        borderColor: "#F2B8B5",
    },
    approveButton: {
        backgroundColor: "#F2FFF6",
        borderColor: "#B7E4C7",
    },
    detailsButton: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: "#F4F4F4",
    },
    detailsText: {
        fontSize: 12,
        color: COLORS.textSub,
        fontWeight: "700",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: COLORS.textSub,
    },
});