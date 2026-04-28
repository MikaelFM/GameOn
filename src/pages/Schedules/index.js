import React, { useState, useCallback } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	SafeAreaView,
	ActivityIndicator,
	Alert,
} from "react-native";
import { COLORS } from "../../constants/colors";
import ScheduleCard from "../../components/ScheduleCard";
import ReservaDetailsModal from '../../components/ReservaDetailsModal';
import { listReservas, cancelReserva } from "../../services/reservaService";
import { useFocusEffect } from "@react-navigation/native";

const MONTH_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function formatDate(iso) {
	const d = new Date(iso);
	return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

function formatTime(iso) {
	const d = new Date(iso);
	return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function mapReserva(reserva) {
	return {
		id: String(reserva.id),
		courtName: reserva.quadra?.nome ?? 'Quadra',
		location: reserva.quadra?.esporte ?? '',
		date: formatDate(reserva.dataInicio),
		time: formatTime(reserva.dataInicio),
		status: reserva.status,
		codigoSeguranca: reserva.codigoSeguranca ?? null,
		raw: reserva,
	};
}

export default function Schedules() {
	const [activeTab, setActiveTab] = useState("upcoming");
	const [upcoming, setUpcoming] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState(null);
	const [cancellingId, setCancellingId] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedReserva, setSelectedReserva] = useState(null);

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			setErro(null);
			async function fetchReservas() {
				try {
					const response = await listReservas();
					const todas = (response.data ?? []);
					const now = new Date();

					const futuras = todas.filter(r => ['RESERVADO','AGUARDANDO_APROVACAO'].includes(r.status));
					setUpcoming(futuras.filter(r => new Date(r.dataFim) >= now).map(mapReserva));

					const concluidas = todas.filter(r => r.status === 'RESERVADO' && new Date(r.dataFim) < now);
					setCompleted(concluidas.map(mapReserva));
				} catch (e) {
					setErro(e.message || 'Erro ao carregar reservas');
				} finally {
					setLoading(false);
				}
			}
			fetchReservas();
		}, [])
	);

	async function handleCancel(id) {
		setCancellingId(id);
		try {
			await cancelReserva(id);
			setUpcoming(prev => prev.filter(r => r.id !== id));
		} catch (e) {
			Alert.alert('Erro', e.message || 'Não foi possível cancelar a reserva.');
		} finally {
			setCancellingId(null);
		}
	}

	const listData = activeTab === "upcoming" ? upcoming : completed;

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Text style={styles.title}>Meus Jogos</Text>

				<View style={styles.tabContainer}>
					<TouchableOpacity
						style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
						onPress={() => setActiveTab("upcoming")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "upcoming" && styles.activeTabText,
							]}
						>
							Próximos
						</Text>
					</TouchableOpacity>


					<TouchableOpacity
						style={[styles.tab, activeTab === "completed" && styles.activeTab]}
						onPress={() => setActiveTab("completed")}
					>
						<Text
							style={[
								styles.tabText,
								activeTab === "completed" && styles.activeTabText,
							]}
						>
							Concluídos
						</Text>
					</TouchableOpacity>
				</View>

				{loading ? (
					<ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
				) : erro ? (
					<Text style={styles.emptyText}>{erro}</Text>
				) : (
					<FlatList
						data={listData}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<ScheduleCard
								item={item}
								isCompleted={activeTab === "completed"}
								onCancel={handleCancel}
								cancelling={cancellingId === item.id}
								onDetails={(reserva) => { setSelectedReserva(reserva); setModalVisible(true); }}
							/>
						)}
						contentContainerStyle={styles.listContent}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={
							<Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
						}
					/>
				)}
			</View>

				<ReservaDetailsModal visible={modalVisible} reserva={selectedReserva} onClose={() => setModalVisible(false)} onCancel={async (id) => {
					try {
						await cancelReserva(id);
						setModalVisible(false);
						const response = await listReservas();
						const todas = (response.data ?? []);
						const now = new Date();
						const futuras = todas.filter(r => ['RESERVADO','AGUARDANDO_APROVACAO'].includes(r.status));
						setUpcoming(futuras.filter(r => new Date(r.dataFim) >= now).map(mapReserva));
						const concluidas = todas.filter(r => r.status === 'RESERVADO' && new Date(r.dataFim) < now);
						setCompleted(concluidas.map(mapReserva));
					} catch (e) {
						// ignore
					}
				}} />
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
		paddingHorizontal: 20,
		paddingTop: 100,
		paddingBottom: 70
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textMain,
		marginBottom: 20,
	},
	tabContainer: {
		flexDirection: "row",
		backgroundColor: "#EEEEEE",
		borderRadius: 12,
		padding: 4,
		marginBottom: 24,
	},
	tab: {
		flex: 1,
		paddingVertical: 10,
		alignItems: "center",
		borderRadius: 10,
	},
	activeTab: {
		backgroundColor: COLORS.card,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	tabText: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.textSub,
	},
	activeTabText: {
		color: COLORS.primary,
	},
	loader: {
		marginTop: 40,
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
