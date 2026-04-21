import { api } from "./api";

function ensureId(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("ID do usuario e obrigatorio.");
  }
}

export async function statusApi() {
  return api.get("/");
}

export async function listUsuarios() {
  return api.get("/usuarios");
}

export async function createUsuario({ nome, email, senha, tipo }) {
  return api.post("/usuarios", {
    nome,
    email,
    senha,
    tipo,
  });
}

export async function getUsuarioById(id) {
  ensureId(id);
  return api.get(`/usuarios/${id}`);
}

export async function updateUsuario(id, data) {
  ensureId(id);
  return api.put(`/usuarios/${id}`, data);
}

export async function removeUsuario(id) {
  ensureId(id);
  return api.delete(`/usuarios/${id}`);
}
