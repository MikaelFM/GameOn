import {
	Image,
	Text,
	View,
	StyleSheet,
	Alert,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { COLORS } from "../../constants/colors";
import { AuthContext } from "../../contexts/AuthContext";
import { createUsuario, updateUsuario } from "../../services/usuarioService";
import { loginLocador, loginLocatario } from "../../services/loginService";

export default function Cadastro({
	isEditing = false,
	userData = null,
	onClose,
}) {
	const navigation = useNavigation();
	const route = useRoute();
	const userType = route.params?.userType;
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const { signIn } = useContext(AuthContext);

	useEffect(() => {
		if (isEditing && userData) {
			setNome(userData.nome);
			setEmail(userData.email);
		}
	}, []);

	const handleCancel = () => {
		if (isEditing) {
			onClose();
		} else {
			navigation.goBack();
		}
	};
	const handleSalvar = async () => {
		if (isEditing) {
			if (!userData?.id) {
				Alert.alert("Erro", "Usuário inválido para edição.");
				return;
			}

			try {
				setLoading(true);
				await updateUsuario(userData.id, {
					nome,
					email,
					senha: password,
					tipo: userType,
				});

				Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
				onClose();
			} catch (error) {
				Alert.alert("Erro", error.message || "Erro ao atualizar usuário.");
			} finally {
				setLoading(false);
			}
		} else {
			if (!nome || !email || !password || !confirmPassword) {
				Alert.alert("Erro", "Preencha todos os campos.");
				return;
			}

			if (password !== confirmPassword) {
				Alert.alert("Erro", "As senhas não conferem.");
				return;
			}

			if (password.length < 10) {
				Alert.alert("Erro", "A senha deve ter no mínimo 10 caracteres.");
				return;
			}

			try {
				setLoading(true);
				const response = await createUsuario({
					nome,
					email,
					senha: password,
					tipo: userType === "owner" ? "LOCADOR" : "LOCATARIO", // mapeia corretamente
				});

				Alert.alert("Sucesso", "Cadastro realizado com sucesso!");

				const loginResponse = await loginLocador({
					email,
					senha: password,
				});

				if (userType === "owner") {
					navigation.navigate("formOwner", {
						usuario: loginResponse.usuario,
						Ltoken: loginResponse.token,
					});
				} else {
					signIn({
						user: loginResponse.usuario,
						token: loginResponse.token,
					});
					navigation.replace("home");
				}
			} catch (error) {
				Alert.alert("Erro", error.message || "Erro ao cadastrar usuário.");
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
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
						<Image
							source={require("../../assets/images/logo_gameOn.png")}
							style={{ width: 220, height: 170 }}
						/>
						<Text style={styles.cadastro}>
							{isEditing ? "Editar Perfil" : "Cadastro"}
						</Text>
						<Input
							placeholder="Insira seu nome"
							value={nome}
							onChangeText={setNome}
						/>
						<Input
							placeholder="Insira seu e-mail"
							value={email}
							onChangeText={setEmail}
						/>
						<Input
							placeholder="Insira a senha"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={true}
						/>
						<Input
							placeholder="Confirme a senha"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.container_buttons}>
						<Button
							label={"Cancelar"}
							type={"cancel"}
							onPress={handleCancel}
							disabled={loading}
						/>
						<Button
							label={"Salvar"}
							onPress={handleSalvar}
							disabled={loading}
						/>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		width: "100%",
	},
	container_inputs: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 30,
	},
	container_buttons: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		width: "50%",
	},
	cadastro: {
		fontSize: 26,
		color: COLORS.textMain,
		marginBottom: 30,
		fontWeight: "500",
	},
});
