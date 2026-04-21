import axios from "axios";
import { Platform } from "react-native";
import { tokenService } from "./tokenService";

const LOCAL_API_BASE_URL = "http://192.168.0.12:3000";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || LOCAL_API_BASE_URL;

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
	onUnauthorized = handler;
};

const api = axios.create({
	baseURL: BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	async (config) => {
		try {
			const token = await tokenService.obterToken();

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			return config;
		} catch (error) {
			return Promise.reject(error);
		}
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => {
		return {
			status: response.status,
			...response.data,
		};
	},
	async (error) => {
		let message = "Erro ao conectar com o servidor";
		const requestUrl = error?.config?.url || "";
		const isAuthLoginRequest =
			requestUrl.includes("/auth/login/locador") ||
			requestUrl.includes("/auth/login/locatario");

		if (error.response) {
			switch (error.response.status) {
				case 400:
					message =
						error.response.data?.erro ||
						error.response.data?.mensagem ||
						error.response.data?.message ||
						"Requisicao invalida";
					break;
				case 401:
					message =
						error.response.data?.erro ||
						error.response.data?.mensagem ||
						error.response.data?.message ||
						"Sessao expirada. Faca login novamente";

					if (!isAuthLoginRequest) {
						await tokenService.limparToken();
						if (typeof onUnauthorized === "function") {
							onUnauthorized();
						}
					}
					break;
				case 403:
					message =
						error.response.data?.erro ||
						error.response.data?.mensagem ||
						error.response.data?.message ||
						"Acesso negado";
					break;
				case 404:
					message =
						error.response.data?.erro ||
						error.response.data?.mensagem ||
						error.response.data?.message ||
						"Recurso nao encontrado";
					break;
				case 500:
					message =
						error.response.data?.erro ||
						error.response.data?.mensagem ||
						error.response.data?.message ||
						"Erro no servidor";
					break;
				default:
					message =
						error.response.data?.erro ||
						error.response.data?.mensagem ||
						error.response.data?.message ||
						"Erro desconhecido";
			}
		} else if (error.request) {
			message = "Sem conexao com o servidor";
		}

		console.log("API Error:", {
			message,
			status: error.response?.status,
			data: error.response?.data,
			url: error.config?.url,
		});

		return Promise.reject({
			message,
			status: error.response?.status,
			data: error.response?.data,
			original: error,
		});
	},
);

export { api, BASE_URL, tokenService };
export default api;
