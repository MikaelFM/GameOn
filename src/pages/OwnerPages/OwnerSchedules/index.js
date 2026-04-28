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
import {
    CalendarProvider,
    ExpandableCalendar,
    LocaleConfig
} from "react-native-calendars";
import { format } from "date-fns";
import { COLORS } from "../../../constants/colors";
import {
    getReservasLocadorDia,
    cancelReserva,
    updateReservaStatus,
} from "../../../services/reservaService";
import ReservaDetailsModal from '../../../components/ReservaDetailsModal';

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan.','Fev.','Mar','Abr','Mai','Jun','Jul.','Ago','Set.','Out.','Nov.','Dez.'],
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function OwnerCalendar() {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [layoutReady, setLayoutReady] = useState(false);

    useEffect(() => {
        loadReservas();
    }, [selectedDate]);

    async function loadReservas() {
        setLoading(true);
        try {
            const response = await getReservasLocadorDia(selectedDate);
            const lista = Array.isArray(response.data?.reservas) ? response.data.reservas : [];
            setReservas(lista.filter((reserva) => reserva?.status !== 'CANCELADO'));
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

    function getStatusVisual(status) {
        switch (status) {
            case 'AGUARDANDO_APROVACAO':
                return { icon: 'time-outline', label: 'Pendente', color: '#D98C1E' };
            case 'RESERVADO':
                return { icon: 'checkmark-circle-outline', label: 'Confirmado', color: COLORS.primary };
            case 'CANCELADO':
                return { icon: 'close-circle-outline', label: 'Cancelado', color: '#B42318' };
            default:
                return { icon: 'information-circle-outline', label: status, color: COLORS.textSub };
        }
    }

    const handleCancel = (id) => {
        Alert.alert("Confirmar", "Você deseja mesmo cancelar esta reserva?", [
            { text: "Não", style: "cancel" },
            {
                text: "Sim",
                style: "destructive",
                onPress: async () => {
                    try {
                        await cancelReserva(id);
                        setModalVisible(false);
                        await loadReservas();
                    } catch (error) {
                        Alert.alert('Erro', error?.message || 'Erro ao cancelar reserva.');
                    }
                },
            },
        ]);
    };

    const handleDecisaoReserva = async (reserva, status) => {
        if (!reserva?.id) return;
        const aprovar = status === 'RESERVADO';
        Alert.alert(
            aprovar ? 'Aprovar agendamento' : 'Reprovar agendamento',
            `Deseja ${aprovar ? 'aprovar' : 'reprovar'} o agendamento de ${reserva?.locatario?.nome ?? 'cliente'}?`,
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
                            Alert.alert('Erro', 'Erro ao atualizar agendamento.');
                        } finally {
                            setActionLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Calendário</Text>
                <View style={styles.headerLine} />
            </View>

            <View style={{ flex: 1 }} onLayout={() => setLayoutReady(true)}>
                <CalendarProvider
                    date={selectedDate}
                    onDateChanged={(date) => setSelectedDate(date)}
                    showTodayButton
                    theme={{ todayButtonTextColor: COLORS.primary }}
                >
                    {layoutReady && (
                        <ExpandableCalendar
                            firstDay={1}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: COLORS.primary },
                            }}
                            theme={{
                                calendarBackground: COLORS.card,
                                todayTextColor: COLORS.primary,
                                arrowColor: COLORS.primary,
                                selectedDayBackgroundColor: COLORS.primary,
                                textDayFontWeight: "500",
                                textMonthFontWeight: "bold",
                                textDayHeaderFontWeight: "500",
                            }}
                            style={styles.calendarStyle}
                        />
                    )}

                    <View style={styles.content}>
                        <Text style={styles.title}>Reservas do dia</Text>

                        {loading ? (
                            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContent}
                            >
                                {reservas.length > 0 ? (
                                    reservas.map((item) => {
                                        const visual = getStatusVisual(item.status);
                                        return (
                                            <View key={item.id.toString()} style={styles.reservaCard}>
                                                <View style={styles.reservaInfo}>
                                                    <View style={styles.pendingRow}>
                                                        <Ionicons name={visual.icon} size={16} color={visual.color} />
                                                        <Text style={[styles.pendingText, { color: visual.color }]}>{visual.label}</Text>
                                                    </View>
                                                    <Text style={styles.reservaTime}>
                                                        {formatHora(item.periodo?.dataInicio)} - {formatHora(item.periodo?.dataFim)}
                                                    </Text>
                                                    <Text style={styles.reservaClient}>{item.locatario?.nome}</Text>
                                                    <Text style={styles.reservaQuadra}>{item.quadra?.nome}</Text>
                                                </View>

                                                <View style={styles.cardActions}>
													<View>
														{item.status === 'AGUARDANDO_APROVACAO' && (
															<View style={styles.actionRow}>
																<TouchableOpacity
																	style={[styles.actionButton, styles.approveButton]}
																	onPress={() => handleDecisaoReserva(item, 'RESERVADO')}
																	disabled={actionLoading}
																>
																	<Ionicons name="checkmark" size={22} color="#2B9D48" />
																</TouchableOpacity>
																<TouchableOpacity
																	style={[styles.actionButton, styles.rejectButton]}
																	onPress={() => handleDecisaoReserva(item, 'CANCELADO')}
																	disabled={actionLoading}
																>
																	<Ionicons name="close" size={22} color="#B42318" />
																</TouchableOpacity>
															</View>
														)}
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
                </CalendarProvider>
            </View>

            <ReservaDetailsModal
                visible={modalVisible}
                reserva={selectedReserva}
                onClose={() => setModalVisible(false)}
                onCancel={selectedReserva?.status !== 'CANCELADO' ? (id) => handleCancel(id) : undefined}
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
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: COLORS.card,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textMain,
        textAlign: "center",
    },
    headerLine: {
        height: 1,
        backgroundColor: COLORS.border,
        marginTop: 15,
    },
    calendarStyle: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textMain,
        marginVertical: 15,
    },
    listContent: {
        paddingBottom: 40,
    },
    reservaCard: {
        backgroundColor: COLORS.card,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    reservaInfo: {
        flex: 1,
    },
    pendingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 5,
    },
    pendingText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    reservaTime: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    reservaClient: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.textMain,
    },
    reservaQuadra: {
        fontSize: 13,
        color: COLORS.textSub,
    },
    cardActions: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingLeft: 10,
    },
    actionRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 5,
    },
    actionButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
    },
    approveButton: {
        backgroundColor: "#F2FFF6",
        borderColor: "#B7E4C7",
    },
    rejectButton: {
        backgroundColor: "#FFF5F5",
        borderColor: "#F2B8B5",
    },
    detailsButton: {
        backgroundColor: "#f8f8f8",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    detailsText: {
        fontSize: 12,
        color: COLORS.textSub,
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 30,
        color: COLORS.textSub,
    },
});
