import { api } from "./api";

function ensureId(id, fieldName = "ID") {
  if (id === undefined || id === null || id === "") {
    throw new Error(`${fieldName} e obrigatorio.`);
  }
}

export async function listReservas() {
  return api.get("/reservas");
}

export async function getProximaReserva() {
  return api.get("/reservas/proxima");
}

export async function getProximaReservaCliente(locatarioId) {
  ensureId(locatarioId, "locatarioId");
  return api.get(`/reservas/clientes/${locatarioId}/proxima`);
}

export async function getDisponibilidadeReserva({ quadraId, dataInicio, dataFim }) {
  ensureId(quadraId, "quadraId");
  if (!dataInicio || !dataFim) {
    throw new Error("dataInicio e dataFim sao obrigatorios.");
  }

  return api.get("/reservas/disponibilidade", {
    params: {
      quadraId,
      dataInicio,
      dataFim,
    },
  });
}

export async function createReserva({ quadraId, dataInicio, dataFim }) {
  ensureId(quadraId, "quadraId");
  if (!dataInicio || !dataFim) {
    throw new Error("dataInicio e dataFim sao obrigatorios.");
  }

  return api.post("/reservas", {
    quadraId,
    dataInicio,
    dataFim,
  });
}

export async function getReservaById(id) {
  ensureId(id, "id");
  return api.get(`/reservas/${id}`);
}

export async function updateReservaStatus(id, status) {
  ensureId(id, "id");
  if (!status) {
    throw new Error("status e obrigatorio.");
  }

  return api.patch(`/reservas/${id}/status`, { status });
}

export async function cancelReserva(id) {
  ensureId(id, "id");
  return api.delete(`/reservas/${id}/cancelar`);
}

export async function getReservasLocadorDia(data) {
  if (!data) {
    throw new Error("data e obrigatoria.");
  }

  return api.get("/reservas/locador/dia", {
    params: { data },
  });
}

export async function getClientesByQuadra(quadraId) {
  ensureId(quadraId, "quadraId");
  return api.get(`/reservas/quadra/${quadraId}/clientes`);
}

export async function getClientesByLocador(locadorId) {
  ensureId(locadorId, "locadorId");
  return api.get(`/reservas/locador/${locadorId}/clientes`);
}

export async function getHistoricoLocador() {
  return api.get("/reservas/locador/historico");
}

export async function getReservasByQuadra(quadraId) {
  ensureId(quadraId, "quadraId");
  return api.get(`/reservas/quadra/${quadraId}`);
}
