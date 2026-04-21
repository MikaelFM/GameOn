import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@devmobile_auth_token';
const USER_DATA_KEY = '@devmobile_user_data';

const memoryStorage = new Map();

function hasBrowserStorage() {
  return typeof globalThis !== 'undefined' && !!globalThis.localStorage;
}

function isAsyncStorageUnavailable(error) {
  const message = String(error?.message || error || '').toLowerCase();
  return message.includes('native module is null') || message.includes('legacy storage');
}

async function setValue(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return;
  } catch (error) {
    if (!isAsyncStorageUnavailable(error)) {
      throw error;
    }
  }

  if (hasBrowserStorage()) {
    globalThis.localStorage.setItem(key, value);
    return;
  }

  memoryStorage.set(key, value);
}

async function getValue(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    if (!isAsyncStorageUnavailable(error)) {
      throw error;
    }
  }

  if (hasBrowserStorage()) {
    return globalThis.localStorage.getItem(key);
  }

  return memoryStorage.get(key) || null;
}

async function removeValue(key) {
  try {
    await AsyncStorage.removeItem(key);
    return;
  } catch (error) {
    if (!isAsyncStorageUnavailable(error)) {
      throw error;
    }
  }

  if (hasBrowserStorage()) {
    globalThis.localStorage.removeItem(key);
    return;
  }

  memoryStorage.delete(key);
}

async function safeMultiSet(entries) {
  if (typeof AsyncStorage?.multiSet === 'function') {
    try {
      await AsyncStorage.multiSet(entries);
      return;
    } catch (error) {
      if (!isAsyncStorageUnavailable(error)) {
        throw error;
      }
    }
  }

  if (hasBrowserStorage()) {
    entries.forEach(([key, value]) => {
      globalThis.localStorage.setItem(key, value);
    });
    return;
  }

  await Promise.all(entries.map(([key, value]) => setValue(key, value)));
}

async function safeMultiRemove(keys) {
  if (typeof AsyncStorage?.multiRemove === 'function') {
    try {
      await AsyncStorage.multiRemove(keys);
      return;
    } catch (error) {
      if (!isAsyncStorageUnavailable(error)) {
        throw error;
      }
    }
  }

  if (hasBrowserStorage()) {
    keys.forEach((key) => {
      globalThis.localStorage.removeItem(key);
    });
    return;
  }

  await Promise.all(keys.map((key) => removeValue(key)));
}

export const tokenService = {

  salvarToken: async (token, userData = null) => {
    try {
    if (!token) {
      return false;
    }

    const updates = [[TOKEN_KEY, String(token)]];
        
    if (userData) {
        updates.push([USER_DATA_KEY, JSON.stringify(userData)]);
    } else {
      await removeValue(USER_DATA_KEY);
        }
        
        await safeMultiSet(updates);

        return true;
    } catch (erro) {
        console.log('Erro ao salvar token:', erro);
        return false;
    }
},


  obterToken: async () => {
    try {
      const token = await getValue(TOKEN_KEY);
      return token;
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
      await safeMultiRemove([TOKEN_KEY, USER_DATA_KEY]);
      return true;
    } catch (erro) {
      return false;
    }
  },

  logout: async (navigation = null) => {
    try {
      await tokenService.limparToken();
      
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      }
      
      return true;
    } catch (erro) {
      return false;
    }
  },
};
