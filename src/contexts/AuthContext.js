import { createContext, useCallback, useEffect, useState } from "react";
import { setUnauthorizedHandler } from "../services/api";
import { tokenService } from "../services/tokenService";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const signIn = useCallback(async ({ user, token }) => {
    if (!token) {
      throw new Error("Token invalido para autenticacao.");
    }

    setUser(user);
    setToken(token);

    const persisted = await tokenService.salvarToken(token, user);
    if (!persisted) {
      setUser(null);
      setToken(null);
      throw new Error("Nao foi possivel salvar a sessao do usuario.");
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
    await tokenService.limparToken();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          tokenService.obterToken(),
          tokenService.obterDadosUsuario(),
        ]);

        if (!isMounted) {
          return;
        }

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ user, token, authLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
