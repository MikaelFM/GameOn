import { api } from "./api";

function ensureId(id, fieldName = "id") {
	if (id === undefined || id === null || id === "") {
		throw new Error(`${fieldName} e obrigatorio.`);
	}
}

export async function listarBloqueiosLocador() {
	return api.get("/bloqueios-quadra");
}

export async function listarBloqueiosPorQuadra(quadraId) {
	ensureId(quadraId, "quadraId");
	return api.get(`/bloqueios-quadra/quadra/${quadraId}`);
}

export async function criarBloqueioQuadra(dados) {
	ensureId(dados?.quadraId, "quadraId");
	if (!dados?.dataInicio || !dados?.dataFim || !dados?.motivo) {
		throw new Error("quadraId, dataInicio, dataFim e motivo sao obrigatorios.");
	}

	return api.post("/bloqueios-quadra", dados);
}

export async function atualizarBloqueioQuadra(bloqueioId, dados) {
	ensureId(bloqueioId, "bloqueioId");
	return api.patch(`/bloqueios-quadra/${bloqueioId}`, dados);
}

export async function deletarBloqueioQuadra(bloqueioId) {
	ensureId(bloqueioId, "bloqueioId");
	return api.delete(`/bloqueios-quadra/${bloqueioId}`);
}

export async function verificarDisponibilidadeQuadra(quadraId, dataInicio, dataFim) {
	ensureId(quadraId, "quadraId");
	if (!dataInicio || !dataFim) {
		throw new Error("dataInicio e dataFim sao obrigatorios.");
	}

	return api.get(`/bloqueios-quadra/verificar/${quadraId}`, {
		params: {
			dataInicio,
			dataFim,
		},
	});
}