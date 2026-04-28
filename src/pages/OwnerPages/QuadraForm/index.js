import {
	Text,
	View,
	StyleSheet,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Image,
	Switch,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useContext, useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getQuadraImageUri } from "../../../services/quadraService";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { TimePicker, FECHADO } from "../../../components/TimePicker";
import { SportCheckboxGroup } from "../../../components/SportCheckboxGroup";
import { COLORS } from "../../../constants/colors";
import { createQuadra, getEsportes, updateQuadra } from "../../../services/quadraService";
import { getReservasByQuadra } from "../../../services/reservaService";
import { AuthContext } from "../../../contexts/AuthContext";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

function horariosToMap(horarios = [], modoEdicao = false) {
	const valorDefault = modoEdicao ? FECHADO : "08:00";
	const map = {
		Seg: { abertura: valorDefault, fechamento: "18:00" },
		Ter: { abertura: valorDefault, fechamento: "18:00" },
		Qua: { abertura: valorDefault, fechamento: "18:00" },
		Qui: { abertura: valorDefault, fechamento: "18:00" },
		Sex: { abertura: valorDefault, fechamento: "18:00" },
		Sab: { abertura: valorDefault, fechamento: "18:00" },
		Dom: { abertura: valorDefault, fechamento: "18:00" },
	};
	horarios.forEach((h) => {
		const dia = DIAS[h.diaSemana];
		if (dia) map[dia] = { abertura: h.horaAbertura, fechamento: h.horaFechamento };
	});
	return map;
}

function extrairEsporteIdsQuadra(quadra) {
	if (!quadra) return [];

	if (Array.isArray(quadra.esporteIds) && quadra.esporteIds.length > 0) {
		return quadra.esporteIds.map((id) => Number(id));
	}

	if (Array.isArray(quadra.esportes) && quadra.esportes.length > 0) {
		return quadra.esportes.map((esporte) => Number(esporte.id ?? esporte)).filter((id) => !Number.isNaN(id));
	}

	if (typeof quadra.esporte === "string" && quadra.esporte.trim()) {
		return [];
	}

	return [];
}

function extrairIdsPorNome(quadra, esportesDisponiveis) {
	if (!quadra?.esporte || !Array.isArray(esportesDisponiveis)) return [];

	const nomes = String(quadra.esporte)
		.split(",")
		.map((nome) => nome.trim())
		.filter(Boolean);

	return nomes
		.map((nome) => esportesDisponiveis.find((opcao) => opcao.nome === nome)?.id)
		.filter((id) => id !== undefined && id !== null)
		.map((id) => Number(id));
}

export default function QuadraForm() {
	const navigation = useNavigation();
	const { params = {} } = useRoute();
	const { user, token: tokenCtx, signIn } = useContext(AuthContext);

	// Detecta o modo pela presença dos params
	const quadraExistente = params.quadra ?? null;
	const modoEdicao = !!quadraExistente;
	const modoSignup = !!params.Ltoken;
	const tokenEfetivo = params.Ltoken ?? tokenCtx;

	const q = quadraExistente ?? {};
	const esporteIdsIniciais = extrairEsporteIdsQuadra(q);

	const [nome, setNome] = useState(q.nome ?? "");
	const [selectedSports, setSelectedSports] = useState(esporteIdsIniciais);
	const [esportesDisponiveis, setEsportesDisponiveis] = useState([]);
	const [carregandoEsportes, setCarregandoEsportes] = useState(true);
	const [valor, setValor] = useState(q.valorPorHora != null ? String(q.valorPorHora) : "");
	const [descricao, setDescricao] = useState(q.descricao ?? "");
	const [endereco, setEndereco] = useState(q.endereco ?? "");
	const [cidade, setCidade] = useState(q.cidade ?? "");
	const [estado, setEstado] = useState(q.estado ?? "");
	const [cep, setCep] = useState(q.cep ?? "");
	const [horariosPorDia, setHorariosPorDia] = useState(
		horariosToMap(q.horarios, modoEdicao)
	);
	const [requerAprovacao, setRequerAprovacao] = useState(q.requerAprovacao ?? true);
	const [bloqueioAprovacao, setBloqueioAprovacao] = useState(false);
	const [carregandoBloqueioAprovacao, setCarregandoBloqueioAprovacao] = useState(false);
	const [horasAntecedencia, setHorasAntecedencia] = useState(
		String(q.horasAntecedenciaCancelamento ?? 6)
	);
	const existingUri = modoEdicao ? getQuadraImageUri(q) : null;
	const [imagem, setImagem] = useState(
		existingUri ? { uri: existingUri, base64: null, mimeType: null } : null
	);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let ativo = true;

		async function carregarEsportes() {
			try {
				setCarregandoEsportes(true);
				const resposta = await getEsportes();
				const lista = Array.isArray(resposta?.data)
					? resposta.data
					: Array.isArray(resposta?.data?.esportes)
					? resposta.data.esportes
					: [];
				if (ativo) {
					setEsportesDisponiveis(lista);
				}
			} catch (error) {
				console.log(error);
				if (ativo) {
					setEsportesDisponiveis([]);
				}
			} finally {
				if (ativo) {
					setCarregandoEsportes(false);
				}
			}
		}

		async function carregarRestricaoAprovacao() {
			if (!modoEdicao || !q.id) {
				setBloqueioAprovacao(false);
				return;
			}

			try {
				setCarregandoBloqueioAprovacao(true);
				const resposta = await getReservasByQuadra(q.id);
				const reservas = Array.isArray(resposta?.data?.reservas)
					? resposta.data.reservas
					: Array.isArray(resposta?.data)
					? resposta.data
					: [];
				const possuiPendentes = reservas.some(
					(reserva) => reserva?.status === "AGUARDANDO_APROVACAO",
				);

				if (ativo) {
					setBloqueioAprovacao(possuiPendentes);
				}
			} catch (error) {
				console.log(error);
				if (ativo) {
					setBloqueioAprovacao(false);
				}
			} finally {
				if (ativo) {
					setCarregandoBloqueioAprovacao(false);
				}
			}
		}

		carregarEsportes();
		carregarRestricaoAprovacao();

		return () => {
			ativo = false;
		};
	}, [modoEdicao, q.id]);

	useEffect(() => {
		const ids = extrairEsporteIdsQuadra(q);
		if (ids.length > 0) {
			setSelectedSports(ids);
			return;
		}

		const idsPorNome = extrairIdsPorNome(q, esportesDisponiveis);
		if (idsPorNome.length > 0) {
			setSelectedSports(idsPorNome);
		}
	}, [q.id, q.esporteIds, q.esportes, q.esporte, esportesDisponiveis]);

	const toggleSport = (sport) =>
		setSelectedSports((prev) =>
			prev.includes(Number(sport))
				? prev.filter((s) => Number(s) !== Number(sport))
				: [...prev, Number(sport)]
		);

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
			setImagem({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType || "image/jpeg" });
		}
	};

	const handleSalvar = async () => {
		if (!nome || selectedSports.length === 0 || !valor) {
			Alert.alert("Erro", "Preencha nome, esportes e valor.");
			return;
		}

		const horas = parseInt(horasAntecedencia, 10);
		if (isNaN(horas) || horas < 0) {
			Alert.alert("Erro", "Horas de antecedência deve ser um número válido.");
			return;
		}

		if (modoEdicao && bloqueioAprovacao && requerAprovacao !== q.requerAprovacao) {
			Alert.alert(
				"Atenção",
				"Não é possível alterar a regra de aprovação enquanto existirem agendamentos aguardando aprovação para esta quadra.",
			);
			return;
		}

		const horariosArray = DIAS
			.filter((dia) => horariosPorDia[dia].abertura !== FECHADO)
			.map((dia) => ({
				diaSemana: DIAS.indexOf(dia),
				horaAbertura: horariosPorDia[dia].abertura,
				horaFechamento: horariosPorDia[dia].fechamento,
			}));

		const dados = {
			nome,
			esporteIds: selectedSports.map((id) => Number(id)),
			valorPorHora: parseFloat(valor),
			descricao,
			endereco,
			cidade,
			estado,
			cep,
			requerAprovacao,
			horasAntecedenciaCancelamento: horas,
			horarios: horariosArray,
			...(imagem?.base64 && {
				imagemBlob: imagem.base64,
				imagemMimeType: imagem.mimeType,
			}),
		};

		if (!modoEdicao) {
			dados.locadorId = modoSignup ? params.usuario.id : user.id;
		}

		try {
			setLoading(true);

			if (modoEdicao) {
				await updateQuadra(q.id, dados);
				Alert.alert("Sucesso", "Quadra atualizada com sucesso!", [
					{ text: "OK", onPress: () => navigation.goBack() },
				]);
			} else {
				await createQuadra(dados, tokenEfetivo);
				if (modoSignup) {
					signIn({ user: params.usuario, token: params.Ltoken });
					navigation.replace("tabs");
				} else {
					Alert.alert("Sucesso", "Quadra cadastrada com sucesso!", [
						{ text: "OK", onPress: () => navigation.goBack() },
					]);
				}
			}
		} catch (error) {
			console.log(error);
			Alert.alert("Erro", error.message || "Erro ao salvar quadra.");
		} finally {
			setLoading(false);
		}
	};

	const titulo = modoEdicao ? "Editar Quadra" : "Cadastrar Quadra";
	const labelBotao = loading
		? modoEdicao ? "Salvando..." : "Cadastrando..."
		: modoEdicao ? "Salvar" : "Cadastrar";

	return (
		<KeyboardAvoidingView
			style={styles.page}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.header}>
					<Text style={styles.titulo}>{titulo}</Text>
					<Text style={styles.subtitulo}>
						{modoEdicao
							? "Atualize as informações da sua quadra"
							: "Preencha os dados para cadastrar sua quadra"}
					</Text>
				</View>

				<TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
					{imagem ? (
						<>
							<Image source={{ uri: imagem.uri }} style={styles.imagePreview} />
							<View style={styles.imageEditOverlay}>
								<Ionicons name="camera" size={18} color="#fff" />
								<Text style={styles.imageEditText}>Alterar foto</Text>
							</View>
						</>
					) : (
						<View style={styles.imagePickerEmpty}>
							<View style={styles.cameraIconWrapper}>
								<Ionicons name="camera-outline" size={34} color={COLORS.primary} />
							</View>
							<Text style={styles.imagePickerTitle}>Foto da quadra</Text>
							<Text style={styles.imagePickerHint}>Toque para adicionar uma imagem</Text>
						</View>
					)}
				</TouchableOpacity>

				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionAccent} />
						<Text style={styles.sectionLabel}>Dados da quadra</Text>
					</View>
					<Input placeholder="Nome da quadra" value={nome} onChangeText={setNome} />
					<Input placeholder="Valor por hora (R$)" value={valor} onChangeText={setValor} keyboardType="numeric" />
					<Input placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
					<Input placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
					<Input placeholder="Cidade" value={cidade} onChangeText={setCidade} />
					<Input placeholder="Estado" value={estado} onChangeText={setEstado} />
					<Input placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
				</View>

				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionAccent} />
						<Text style={styles.sectionLabel}>Esportes disponíveis</Text>
					</View>
					<SportCheckboxGroup
						selected={selectedSports}
						onToggle={toggleSport}
						options={esportesDisponiveis}
						loading={carregandoEsportes}
					/>
				</View>

				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionAccent} />
						<Text style={styles.sectionLabel}>Configurações de reserva</Text>
					</View>

					<View style={styles.switchRow}>
						<View style={styles.switchInfo}>
							<Text style={styles.switchLabel}>Aprovação manual de reservas</Text>
							<Text style={styles.switchDesc}>
								{requerAprovacao
									? "Você aprova manualmente cada reserva"
									: "Reservas são confirmadas automaticamente"}
							</Text>
							{modoEdicao && bloqueioAprovacao && (
								<Text style={styles.lockNotice}>
									Existe ao menos um agendamento aguardando aprovação. Essa configuração não pode ser alterada agora.
								</Text>
							)}
						</View>
						<Switch
							value={requerAprovacao}
							onValueChange={setRequerAprovacao}
							disabled={modoEdicao && (bloqueioAprovacao || carregandoBloqueioAprovacao)}
							trackColor={{ false: COLORS.border, true: COLORS.primary }}
							thumbColor="#fff"
						/>
					</View>

					<View style={styles.antecedenciaRow}>
						<Text style={styles.switchLabel}>Antecedência mínima para cancelar (horas)</Text>
						<Input
							placeholder="Ex: 6"
							value={horasAntecedencia}
							onChangeText={setHorasAntecedencia}
							keyboardType="numeric"
						/>
						<Text style={styles.switchDesc}>
							Locatários só poderão cancelar com pelo menos {horasAntecedencia || "0"}h de antecedência
						</Text>
					</View>
				</View>

				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionAccent} />
						<Text style={styles.sectionLabel}>Horários de funcionamento</Text>
					</View>
					<View style={styles.horarioHeader}>
						<Text style={styles.diaCol} />
						<Text style={styles.horarioColLabel}>Abertura</Text>
						<Text style={styles.horarioColLabel}>Fechamento</Text>
					</View>
					{DIAS.map((dia) => {
						const fechado = horariosPorDia[dia].abertura === FECHADO;
						return (
							<View key={dia} style={styles.horarioRow}>
								<Text style={[styles.diaLabel, fechado && styles.diaInativo]}>{dia}</Text>
								<TimePicker
									showClosedOption
									selectedValue={horariosPorDia[dia].abertura}
									onValueChange={(val) =>
										setHorariosPorDia((prev) => ({ ...prev, [dia]: { ...prev[dia], abertura: val } }))
									}
								/>
								{fechado ? (
									<View style={styles.fechadoPlaceholder} />
								) : (
									<TimePicker
										selectedValue={horariosPorDia[dia].fechamento}
										onValueChange={(val) =>
											setHorariosPorDia((prev) => ({ ...prev, [dia]: { ...prev[dia], fechamento: val } }))
										}
									/>
								)}
							</View>
						);
					})}
				</View>

				<View style={styles.container_buttons}>
					<View style={styles.buttonWrapperLeft}>
						<Button label="Cancelar" type="cancel" onPress={() => navigation.goBack()} disabled={loading} style={styles.buttonFull} />
					</View>
					<View style={styles.buttonWrapperRight}>
						<Button label={labelBotao} onPress={handleSalvar} disabled={loading} style={styles.buttonFull} />
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		marginTop: Platform.OS === "android" ? 80 : 0,
		marginBottom: Platform.OS === "android" ? 80 : 0,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 20,
	},
	header: {
		marginBottom: 20,
	},
	titulo: {
		fontSize: 26,
		color: COLORS.textMain,
		fontWeight: "700",
		letterSpacing: 0.2,
	},
	subtitulo: {
		fontSize: 14,
		color: COLORS.textSub,
		marginTop: 4,
	},
	imagePicker: {
		width: "100%",
		height: 190,
		borderRadius: 16,
		backgroundColor: COLORS.card,
		borderWidth: 1,
		borderColor: COLORS.border,
		overflow: "hidden",
		marginBottom: 16,
	},
	imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
	imageEditOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.45)",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		gap: 6,
	},
	imageEditText: { color: "#fff", fontSize: 13, fontWeight: "600" },
	imagePickerEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
	cameraIconWrapper: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: `${COLORS.primary}1A`,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 4,
	},
	imagePickerTitle: { fontSize: 15, fontWeight: "600", color: COLORS.textMain },
	imagePickerHint: { fontSize: 13, color: COLORS.textSub },
	// Cards
	card: {
		backgroundColor: COLORS.card,
		borderRadius: 16,
		paddingTop: 16,
		paddingBottom: 10,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: COLORS.border,
		width: "100%",
		alignItems: "center",
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 16,
		marginBottom: 12,
		gap: 8,
	},
	sectionAccent: {
		width: 4,
		height: 18,
		borderRadius: 2,
		backgroundColor: COLORS.primary,
	},
	sectionLabel: {
		fontSize: 15,
		fontWeight: "700",
		color: COLORS.textMain,
	},
	// Switch Row
	switchRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "92%",
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 14,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	switchInfo: { flex: 1, marginRight: 12 },
	switchLabel: { fontSize: 14, fontWeight: "600", color: COLORS.textMain, marginBottom: 2 },
	switchDesc: { fontSize: 12, color: COLORS.textSub, marginTop: 4, lineHeight: 17 },
	lockNotice: { fontSize: 12, color: "#B42318", marginTop: 8, lineHeight: 18 },
	antecedenciaRow: {
		width: "92%",
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 14,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
		gap: 6,
	},
	// Horário Table
	horarioHeader: { flexDirection: "row", alignItems: "center", width: "92%", marginBottom: 4, paddingHorizontal: 4 },
	diaCol: { width: 40 },
	horarioColLabel: { flex: 1, textAlign: "left", fontSize: 13, color: COLORS.textSub },
	horarioRow: { flexDirection: "row", alignItems: "center", width: "92%", marginBottom: 8, gap: 8, paddingHorizontal: 4 },
	diaLabel: { width: 40, fontWeight: "bold", fontSize: 14, color: COLORS.textMain },
	diaInativo: { color: COLORS.textSub },
	fechadoPlaceholder: { flex: 1 },
	// Buttons
	container_buttons: {
		flexDirection: "row",
		width: "100%",
		gap: 8,
		marginTop: 8,
		marginBottom: 16,
	},
	buttonWrapperLeft: {
		flex: 1,
	},
	buttonWrapperRight: {
		flex: 1,
	},
	buttonFull: {
		width: "100%",
	},
});
