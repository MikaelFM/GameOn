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

export async function listQuadras(filters = {}) {
  const params = removeEmptyParams({
    cidade: filters.cidade,
    estado: filters.estado,
    esporte: filters.esporte,
    valorMin: filters.valorMin,
    valorMax: filters.valorMax,
  });

  return api.get("/quadras", { params });
}

export async function createQuadra(data) {
  return api.post("/quadras", data);
}

export async function listQuadrasComHorariosDisponiveis() {
  return api.get("/quadras/horarios-disponiveis");
}

export async function getQuadraById(id) {
  ensureId(id, "id");
  return api.get(`/quadras/${id}`);
}

export async function updateQuadra(id, data) {
  ensureId(id, "id");
  return api.put(`/quadras/${id}`, data);
}

export async function deleteQuadra(id) {
  ensureId(id, "id");
  return api.delete(`/quadras/${id}`);
}

export async function filtrarQuadras(filters = {}) {
  const params = removeEmptyParams({
    localizacao: filters.localizacao,
    locadorId: filters.locadorId,
    esporte: filters.esporte,
    dataInicio: filters.dataInicio,
    dataFim: filters.dataFim,
  });

  return api.get("/quadras/filtrar", { params });
}
