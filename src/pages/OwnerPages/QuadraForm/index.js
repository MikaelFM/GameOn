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
			style={{ flex: 1, marginTop: Platform.OS === "android" ? 80 : 0, marginBottom: Platform.OS === "android" ? 80 : 0 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20 }}>
				<View style={styles.container}>
					<View style={styles.container_inputs}>
						<Text style={styles.titulo}>{titulo}</Text>

						<TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
							{imagem ? (
								<Image source={{ uri: imagem.uri }} style={styles.imagePreview} />
							) : (
								<Text style={styles.imagePickerText}>Toque para selecionar uma foto</Text>
							)}
						</TouchableOpacity>

						<Text style={styles.sectionLabel}>Dados</Text>
						<Input placeholder="Nome da quadra" value={nome} onChangeText={setNome} />
						<Input placeholder="Valor por hora" value={valor} onChangeText={setValor} keyboardType="numeric" />
						<Input placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
						<Input placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
						<Input placeholder="Cidade" value={cidade} onChangeText={setCidade} />
						<Input placeholder="Estado" value={estado} onChangeText={setEstado} />
						<Input placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />

						<Text style={styles.sectionLabel}>Esportes disponíveis</Text>
						<SportCheckboxGroup
							selected={selectedSports}
							onToggle={toggleSport}
							options={esportesDisponiveis}
							loading={carregandoEsportes}
						/>

						<Text style={styles.sectionLabel}>Configurações de reserva</Text>

						<View style={styles.switchRow}>
							<View style={styles.switchInfo}>
								<Text style={styles.switchLabel}>Reservas precisam de aprovação</Text>
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

						<Text style={styles.sectionLabel}>Dias e horários de funcionamento</Text>
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

						<View style={styles.container_buttons}>
							<Button label="Cancelar" type="cancel" onPress={() => navigation.goBack()} disabled={loading} />
							<Button label={labelBotao} onPress={handleSalvar} disabled={loading} />
						</View>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
	container_inputs: { width: "100%", justifyContent: "center", alignItems: "center" },
	container_buttons: { flexDirection: "row", justifyContent: "center", gap: 10, width: "50%", marginTop: 20, marginBottom: 10 },
	titulo: { fontSize: 28, color: COLORS.textMain, marginBottom: 16, fontWeight: "600" },
	sectionLabel: { fontSize: 18, marginTop: 20, marginBottom: 8, fontWeight: "500", width: "100%" },
	switchRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 14,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	switchInfo: { flex: 1, marginRight: 12 },
	switchLabel: { fontSize: 14, fontWeight: "600", color: COLORS.textMain, marginBottom: 2 },
	switchDesc: { fontSize: 12, color: COLORS.textSub, marginTop: 4 },
	lockNotice: { fontSize: 12, color: "#B42318", marginTop: 8, lineHeight: 18 },
	antecedenciaRow: {
		width: "100%",
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 14,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
		gap: 6,
	},
	horarioHeader: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 4 },
	diaCol: { width: 40 },
	horarioColLabel: { flex: 1, textAlign: "left", fontSize: 13, color: "#666" },
	horarioRow: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 8, gap: 8 },
	diaLabel: { width: 40, fontWeight: "bold", fontSize: 14, color: COLORS.textMain },
	diaInativo: { color: COLORS.textSub },
	fechadoPlaceholder: { flex: 1 },
	imagePicker: {
		width: "100%",
		height: 180,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.border,
		borderStyle: "dashed",
		backgroundColor: COLORS.card,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		marginBottom: 4,
	},
	imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
	imagePickerText: { color: COLORS.textSub, fontSize: 14 },
});
