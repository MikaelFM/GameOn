import React, { useEffect, useState, useMemo } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	SafeAreaView,
	Modal,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import { COLORS } from "../../../constants/colors";
import {
	getReservasLocadorDia,
	cancelReserva,
} from "../../../services/reservaService";

export default function OwnerCalendar() {
	const [selectedDate, setSelectedDate] = useState(
		format(new Date(), "yyyy-MM-dd"),
	);
	const [reservas, setReservas] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedReserva, setSelectedReserva] = useState(null);

	useEffect(() => {
		loadReservas();
	}, [selectedDate]);

	async function loadReservas() {
		setLoading(true);
		try {
			const response = await getReservasLocadorDia(selectedDate);
			setReservas(response.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
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
					<FlatList
						data={reservas}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.reservaCard}
								onPress={() => {
									setSelectedReserva(item);
									setModalVisible(true);
								}}
							>
								<View style={styles.reservaInfo}>
									<Text style={styles.reservaTime}>
										{item.horaInicio} - {item.horaFim}
									</Text>
									<Text style={styles.reservaClient}>{item.cliente?.nome}</Text>
								</View>
								<Text style={styles.detailsText}>Ver detalhes</Text>
							</TouchableOpacity>
						)}
						contentContainerStyle={styles.listContent}
						ListEmptyComponent={
							<Text style={styles.emptyText}>
								Nenhuma reserva para esta data.
							</Text>
						}
					/>
				)}
			</View>

			{/* Modal de Detalhes no Estilo Game On */}
			<Modal visible={modalVisible} transparent animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Detalhes da Reserva</Text>

						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Cliente</Text>
							<Text style={styles.detailValue}>
								{selectedReserva?.cliente?.nome}
							</Text>
						</View>

						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>E-mail</Text>
							<Text style={styles.detailValue}>
								{selectedReserva?.cliente?.email}
							</Text>
						</View>

						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelActionBtn]}
								onPress={() => handleCancel(selectedReserva?.id)}
							>
								<Text style={styles.buttonTextWhite}>Cancelar Reserva</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.buttonText}>Fechar</Text>
							</TouchableOpacity>
						</View>
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
		flex: 1,
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
		overflow: "hidden",
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textMain,
		marginBottom: 15,
	},
	reservaCard: {
		backgroundColor: COLORS.card,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	reservaTime: {
		fontSize: 12,
		fontWeight: "bold",
		color: COLORS.primary,
	},
	reservaClient: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textMain,
	},
	detailsText: {
		fontSize: 12,
		color: COLORS.textSub,
	},
	listContent: {
		paddingBottom: 20,
	},
	emptyText: {
		textAlign: "center",
		marginTop: 20,
		color: COLORS.textSub,
	},
	// Modal Styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "85%",
		backgroundColor: COLORS.card,
		borderRadius: 20,
		padding: 25,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: COLORS.textMain,
		marginBottom: 20,
		textAlign: "center",
	},
	detailRow: {
		marginBottom: 15,
	},
	detailLabel: {
		fontSize: 12,
		color: COLORS.textSub,
		textTransform: "uppercase",
		marginBottom: 4,
	},
	detailValue: {
		fontSize: 16,
		color: COLORS.textMain,
		fontWeight: "500",
	},
	buttonContainer: {
		marginTop: 10,
	},
	modalButton: {
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 10,
	},
	cancelActionBtn: {
		backgroundColor: "#FF4444",
	},
	buttonTextWhite: {
		color: "#FFF",
		fontWeight: "bold",
	},
	buttonText: {
		color: COLORS.textMain,
		fontWeight: "600",
	},
});
