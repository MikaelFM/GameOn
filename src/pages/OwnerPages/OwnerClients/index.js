import React, { useEffect, useState, useMemo } from "react";
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
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de ter o expo-icons
import { COLORS } from "../../../constants/colors";
import { getClientesByQuadra } from "../../../services/reservaService";

export default function ClientList() {
	const [clientes, setClientes] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [loading, setLoading] = useState(true);

	// ID da quadra (futuramente virá do seu AuthContext ou Params)
	const quadraId = "1";

	const avatarGenerico =
		"https://avatar.iran.liara.run/public/boy?username=User";

	useEffect(() => {
		fetchClientes();
	}, []);

	async function fetchClientes() {
		try {
			setLoading(true);
			const response = await getClientesByQuadra(quadraId);
			setClientes(response.data);
		} catch (error) {
			console.error(error);
			Alert.alert("Erro", "Não foi possível carregar a lista de clientes.");
		} finally {
			setLoading(false);
		}
	}

	// Lógica de pesquisa em tempo real
	const filteredClientes = useMemo(() => {
		return clientes.filter(
			(c) =>
				c.nome.toLowerCase().includes(searchText.toLowerCase()) ||
				c.email.toLowerCase().includes(searchText.toLowerCase()),
		);
	}, [searchText, clientes]);

	const handleBlockClient = (nome) => {
		Alert.alert(
			"Projeto Futuro",
			`A funcionalidade de bloquear ${nome} será implementada em breve!`,
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.headerContainer}>
				<Text style={styles.headerTitle}>Clientes</Text>
				<View style={styles.headerLine} />
			</View>

			<View style={styles.container}>
				{/* Barra de Pesquisa Estilizada */}
				<View style={styles.searchSection}>
					<Ionicons
						name="search-outline"
						size={20}
						color={COLORS.textSub}
						style={styles.searchIcon}
					/>
					<TextInput
						style={styles.input}
						placeholder="Pesquisar por nome ou e-mail..."
						placeholderTextColor={COLORS.textSub}
						value={searchText}
						onChangeText={setSearchText}
					/>
				</View>

				{loading ? (
					<ActivityIndicator
						color={COLORS.primary}
						size="large"
						style={{ marginTop: 50 }}
					/>
				) : (
					<FlatList
						data={filteredClientes}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<View style={styles.clientCard}>
								<View style={styles.clientInfo}>
									<Image
										source={{ uri: avatarGenerico }}
										style={styles.avatar}
									/>
									<View style={styles.textContainer}>
										<Text style={styles.clientName}>{item.nome}</Text>
										<Text style={styles.clientEmail}>{item.email}</Text>
									</View>
								</View>

								<TouchableOpacity
									style={styles.blockButton}
									onPress={() => handleBlockClient(item.nome)}
								>
									<Ionicons name="ban-outline" size={20} color="#FF4444" />
								</TouchableOpacity>
							</View>
						)}
						contentContainerStyle={styles.listContent}
						ListEmptyComponent={
							<Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
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
	blockButton: {
		padding: 10,
		backgroundColor: "#FFF1F1",
		borderRadius: 10,
		marginLeft: 10,
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
