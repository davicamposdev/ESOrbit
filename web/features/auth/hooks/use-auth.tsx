"use client";

/**
 * Hook de autenticação - Gerencia o estado do usuário logado
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService, type User } from "../services";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Tenta renovar o token usando o refresh token
   */
  const refreshAuth = useCallback(async () => {
    try {
      const { accessToken } = await authService.refresh();
      authService.setAccessToken(accessToken);

      // Busca os dados do usuário
      const { user } = await authService.me();
      setUser(user);

      // Salva o token no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }
    } catch (error) {
      // Se falhar, limpa tudo
      authService.setAccessToken(null);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      throw error;
    }
  }, []);

  /**
   * Carrega o usuário ao montar o componente
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Tenta recuperar o token do localStorage
        const storedToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (storedToken) {
          authService.setAccessToken(storedToken);

          try {
            // Tenta buscar o usuário
            const { user } = await authService.me();
            setUser(user);
          } catch (error) {
            // Se o token expirou, tenta renovar silenciosamente
            try {
              await refreshAuth();
            } catch (refreshError) {
              // Se refresh falhar, apenas limpa tudo
              console.log("Sessão expirada. Faça login novamente.");
            }
          }
        }
        // Se não tem token no localStorage, não faz nada
        // (usuário não está logado)
      } catch (error) {
        // Se falhar, usuário não está autenticado
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [refreshAuth]);

  /**
   * Faz login do usuário
   */
  const login = useCallback(async (email: string, password: string) => {
    const { user, accessToken } = await authService.login({ email, password });

    authService.setAccessToken(accessToken);
    setUser(user);

    // Salva o token no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }
  }, []);

  /**
   * Registra um novo usuário
   */
  const register = useCallback(
    async (email: string, username: string, password: string) => {
      const { user, accessToken } = await authService.register({
        email,
        username: username,
        password,
      });

      authService.setAccessToken(accessToken);
      setUser(user);

      // Salva o token no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }
    },
    []
  );

  /**
   * Faz logout do usuário
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      authService.setAccessToken(null);
      setUser(null);

      // Remove o token do localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
