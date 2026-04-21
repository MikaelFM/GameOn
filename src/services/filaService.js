import { api } from "./api";

function ensureId(id, fieldName = "id") {
  if (id === undefined || id === null || id === "") {
    throw new Error(`${fieldName} e obrigatorio.`);
  }
}

function removeEmptyParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export async function buscarStatusFila(id) {
  ensureId(id, "id");
  return api.get(`/fila/status/${id}`);
}

export async function confirmarOfertaFila(id) {
  ensureId(id, "id");
  return api.post(`/fila/confirmar/${id}`);
}

export async function listarFila(params = {}) {
  const queryParams = removeEmptyParams({
    quadraId: params.quadraId,
    dataInicio: params.dataInicio,
    dataFim: params.dataFim,
  });

  return api.get("/fila/listar", { params: queryParams });
}
