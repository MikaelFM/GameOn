import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'devmobile_auth_token';
const USER_DATA_KEY = 'devmobile_user_data';

const memoryStorage = new Map();

function hasBrowserStorage() {
  return typeof globalThis !== 'undefined' && !!globalThis.localStorage;
}

async function setValue(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
    return;
  } catch (error) {
    console.warn('SecureStore.setItemAsync falhou:', error?.message);
  }

  if (hasBrowserStorage()) {
    globalThis.localStorage.setItem(key, value);
    return;
  }

  memoryStorage.set(key, value);
}

async function getValue(key) {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (error) {
    console.warn('SecureStore.getItemAsync falhou:', error?.message);
  }

  if (hasBrowserStorage()) {
    return globalThis.localStorage.getItem(key);
  }

  return memoryStorage.get(key) ?? null;
}

async function removeValue(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    return;
  } catch (error) {
    console.warn('SecureStore.deleteItemAsync falhou:', error?.message);
  }

  if (hasBrowserStorage()) {
    globalThis.localStorage.removeItem(key);
    return;
  }

  memoryStorage.delete(key);
}

export const tokenService = {
  salvarToken: async (token, userData = null) => {
    if (!token) return false;

    try {
      await setValue(TOKEN_KEY, String(token));

      if (userData) {
        await setValue(USER_DATA_KEY, JSON.stringify(userData));
      } else {
        await removeValue(USER_DATA_KEY);
      }

      return true;
    } catch (erro) {
      console.error('Erro ao salvar token:', erro);
      return false;
    }
  },

  obterToken: async () => {
    try {
      return await getValue(TOKEN_KEY);
    } catch (erro) {
      return null;
    }
  },

  obterDadosUsuario: async () => {
    try {
      const userData = await getValue(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (erro) {
      return null;
    }
  },

  temToken: async () => {
    try {
      const token = await getValue(TOKEN_KEY);
      return !!token;
    } catch (erro) {
      return false;
    }
  },

  limparToken: async () => {
    try {
      await removeValue(TOKEN_KEY);
      await removeValue(USER_DATA_KEY);
      return true;
    } catch (erro) {
      return false;
    }
  },

  logout: async (navigation = null) => {
    try {
      await tokenService.limparToken();

      if (navigation) {
        navigation.reset({ index: 0, routes: [{ name: 'login' }] });
      }

      return true;
    } catch (erro) {
      return false;
    }
  },
};
