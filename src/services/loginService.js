import { api } from "./api";

function normalizeRole(rawRole) {
	if (!rawRole) {
		return "user";
	}

	const role = String(rawRole).toLowerCase();

	if (role === "locador" || role === "owner") {
		return "owner";
	}

	return "user";
}

function normalizeAuthResponse(data) {
	const usuario = data?.usuario || data?.user || {};
	const token = data?.token;

	if (!token) {
		throw new Error("Resposta de autenticacao invalida: token nao informado.");
	}

	return {
		mensagem: data?.mensagem || data?.message,
		token,
		usuario: {
			...usuario,
			role: normalizeRole(usuario?.role || usuario?.tipo),
		},
	};
}

export async function loginLocador({ email, senha }) {
	const response = await api.post("/auth/login/locador", {
		email,
		senha,
	});
	return normalizeAuthResponse(response.data);
}

export async function loginLocatario({ email, senha }) {
	const response = await api.post("/auth/login/locatario", {
		email,
		senha,
	});
	console.log("Resposta da API de login locatario:", response);
	return normalizeAuthResponse(response.data);
}

export async function logoutUser({ id, token }) {
	if (!id) {
		return { mensagem: "Logout local realizado." };
	}

	return api.post(
		`/auth/logout/${id}`,
		{},
		{
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		},
	);
}
