"use client";

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
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback(async () => {
    try {
      const { user } = await authService.me();
      setUser(user);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      throw error;
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const { accessToken } = await authService.refresh();
      authService.setAccessToken(accessToken);

      const { user } = await authService.me();
      setUser(user);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }
    } catch (error) {
      // Refresh falhou - limpar tudo
      authService.setAccessToken(null);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (storedToken) {
          authService.setAccessToken(storedToken);

          try {
            // O interceptor do api-client vai tentar refresh automaticamente se necessário
            const { user } = await authService.me();
            setUser(user);
          } catch (error) {
            // Se chegou aqui, tanto o token quanto o refresh falharam
            // Limpar tudo e usuário precisa fazer login novamente
            authService.setAccessToken(null);
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("accessToken");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, accessToken } = await authService.login({ email, password });

    console.log("Login bem-sucedido, usuário:", user);
    authService.setAccessToken(accessToken);
    setUser(user);

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }
  }, []);

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      const { user, accessToken } = await authService.register({
        email,
        username: username,
        password,
      });

      authService.setAccessToken(accessToken);
      setUser(user);

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      authService.setAccessToken(null);
      setUser(null);

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
        updateUser,
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
