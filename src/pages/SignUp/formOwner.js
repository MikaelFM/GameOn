import {
	Text,
	View,
	StyleSheet,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Image,
	TouchableOpacity,
} from "react-native";

import { useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { TimePicker } from "../../components/TimePicker";
import { SportCheckboxGroup } from "../../components/SportCheckboxGroup";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../contexts/AuthContext";
import { createQuadra } from "../../services/quadraService";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

export default function Cadastro() {
	const navigation = useNavigation();
	const [nome, setNome] = useState("");
	const [selectedSports, setSelectedSports] = useState([]);
	const [valor, setValor] = useState("");
	const [descricao, setDescricao] = useState("");
	const [endereco, setEndereco] = useState("");
	const [cidade, setCidade] = useState("");
	const [estado, setEstado] = useState("");
	const [cep, setCep] = useState("");
	const [horariosPorDia, setHorariosPorDia] = useState({
		Seg: { abertura: "08:00", fechamento: "18:00" },
		Ter: { abertura: "08:00", fechamento: "18:00" },
		Qua: { abertura: "08:00", fechamento: "18:00" },
		Qui: { abertura: "08:00", fechamento: "18:00" },
		Sex: { abertura: "08:00", fechamento: "18:00" },
		Sab: { abertura: "08:00", fechamento: "18:00" },
		Dom: { abertura: "08:00", fechamento: "18:00" },
	});
	const [imagem, setImagem] = useState(null); // { uri, base64, mimeType }
	const [loading, setLoading] = useState(false);

	const { signIn, token } = useContext(AuthContext);
	const route = useRoute();
	const { usuario, Ltoken } = route.params;

	const handlePickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("Permissão necessária", "Permita o acesso à galeria para selecionar uma foto.");
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.7,
			base64: true,
		});
		if (!result.canceled && result.assets?.[0]) {
			const asset = result.assets[0];
			setImagem({
				uri: asset.uri,
				base64: asset.base64,
				mimeType: asset.mimeType || "image/jpeg",
			});
		}
	};

	const toggleSport = (sport) => {
		setSelectedSports((prev) =>
			prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
		);
	};

	const handleCadastro = async () => {
		if (
			!nome ||
			selectedSports.length === 0 ||
			!valor ||
			!descricao ||
			!endereco ||
			!cidade ||
			!estado ||
			!cep
		) {
			Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
			return;
		}

		const horariosArray = dias.map((dia, index) => ({
			diaSemana: index, // 0 = domingo, 1 = segunda...
			horaAbertura: horariosPorDia[dia].abertura,
			horaFechamento: horariosPorDia[dia].fechamento,
		}));

		const dadosQuadra = {
			nome,
			esporte: selectedSports[0],
			valorPorHora: parseFloat(valor),
			descricao,
			endereco,
			cidade,
			estado,
			cep,
			horarios: horariosArray,
			...(imagem?.base64 && {
				imagemBlob: imagem.base64,
				imagemMimeType: imagem.mimeType,
			}),
		};

		try {
			setLoading(true);

			const response = await createQuadra(dadosQuadra, Ltoken);

			Alert.alert("Sucesso", "Quadra cadastrada com sucesso!");

			signIn({
				user: usuario,
				token: Ltoken,
			});

			navigation.replace("tabs");
		} catch (error) {
			Alert.alert("Erro", error.message || "Erro ao cadastrar quadra.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
				marginTop: Platform.OS === "android" ? 80 : 0,
				marginBottom: Platform.OS === "android" ? 80 : 0,
			}}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					paddingHorizontal: 20,
				}}
			>
				<View style={styles.container}>
					<View style={styles.container_inputs}>
						<Text style={styles.cadastro}>Cadastro</Text>

						<Input
							placeholder="Insira o nome da empresa"
							value={nome}
							onChangeText={setNome}
						/>

						<Input
							placeholder="Insira o valor do aluguel (por hora)"
							value={valor}
							onChangeText={setValor}
							keyboardType="numeric"
						/>

						<Input
							placeholder="Insira a descrição do espaço"
							value={descricao}
							onChangeText={setDescricao}
						/>

						<Input
							placeholder="Insira o endereço"
							value={endereco}
							onChangeText={setEndereco}
						/>

						<Input
							placeholder="Insira a cidade"
							value={cidade}
							onChangeText={setCidade}
						/>

						<Input
							placeholder="Insira o estado"
							value={estado}
							onChangeText={setEstado}
						/>

						<Input
							placeholder="Insira o CEP"
							value={cep}
							onChangeText={setCep}
							keyboardType="numeric"
						/>

						<Text style={styles.sectionLabel}>Foto da quadra</Text>
						<TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
							{imagem ? (
								<Image source={{ uri: imagem.uri }} style={styles.imagePreview} />
							) : (
								<Text style={styles.imagePickerText}>Toque para selecionar uma foto</Text>
							)}
						</TouchableOpacity>

						<Text style={styles.sectionLabel}>Esportes disponíveis</Text>
						<SportCheckboxGroup
							selected={selectedSports}
							onToggle={toggleSport}
						/>

						<Text style={styles.sectionLabel}>Horários por dia</Text>
						<View style={styles.horarioHeader}>
							<Text style={{ width: 50 }}></Text>
							<Text style={styles.horarioColLabel}>Abertura</Text>
							<Text style={styles.horarioColLabel}>Fechamento</Text>
						</View>

						{dias.map((dia) => (
							<View key={dia} style={styles.horarioRow}>
								<Text style={styles.diaLabel}>{dia}</Text>
								<TimePicker
									selectedValue={horariosPorDia[dia].abertura}
									onValueChange={(val) =>
										setHorariosPorDia((prev) => ({
											...prev,
											[dia]: { ...prev[dia], abertura: val },
										}))
									}
								/>
								<TimePicker
									selectedValue={horariosPorDia[dia].fechamento}
									onValueChange={(val) =>
										setHorariosPorDia((prev) => ({
											...prev,
											[dia]: { ...prev[dia], fechamento: val },
										}))
									}
								/>
							</View>
						))}

						<View style={styles.container_buttons}>
							<Button
								label={"Cancelar"}
								type={"cancel"}
								onPress={() => navigation.goBack()}
								disabled={loading}
							/>
							<Button
								label={"Salvar"}
								onPress={handleCadastro}
								disabled={loading}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	container_inputs: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	container_buttons: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		width: "50%",
		marginTop: 20,
	},
	cadastro: {
		fontSize: 32,
		color: COLORS.textMain,
		marginBottom: 20,
		fontWeight: "600",
	},
	sectionLabel: {
		fontSize: 18,
		marginTop: 20,
		marginBottom: 8,
		fontWeight: "500",
	},
	horarioHeader: {
		flexDirection: "row",
		alignItems: "center",
		width: "80%",
		margin: 5,
	},
	horarioColLabel: {
		flex: 1,
		textAlign: "left",
		fontSize: 14,
		color: "#666",
	},
	horarioRow: {
		flexDirection: "row",
		alignItems: "center",
		width: "84%",
		marginBottom: 8,
		gap: 8,
	},
	diaLabel: {
		width: 40,
		fontWeight: "bold",
		fontSize: 14,
	},
	imagePicker: {
		width: "100%",
		height: 160,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderStyle: "dashed",
		backgroundColor: COLORS.card,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		marginBottom: 8,
	},
	imagePreview: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	imagePickerText: {
		color: COLORS.textSub,
		fontSize: 14,
	},
});
