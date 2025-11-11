/**
 * Serviço de autenticação - Comunicação com o módulo auth da API
 */

import { apiClient } from "./api-client";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface MeResponse {
  user: User;
}

export class AuthService {
  /**
   * Registra um novo usuário
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/register", data);
  }

  /**
   * Faz login do usuário
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/login", data);
  }

  /**
   * Renova o access token usando o refresh token (cookie)
   */
  async refresh(): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>("/api/auth/refresh");
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<{ ok: boolean }> {
    return apiClient.post<{ ok: boolean }>("/api/auth/logout");
  }

  /**
   * Obtém os dados do usuário autenticado
   */
  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>("/api/auth/me");
  }

  /**
   * Define o access token no cliente
   */
  setAccessToken(token: string | null) {
    apiClient.setAccessToken(token);
  }

  /**
   * Obtém o access token atual
   */
  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }
}

export const authService = new AuthService();
