import { apiClient } from "./api-client";

export interface User {
  id: string;
  email: string;
  username: string;
  credits: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
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
  async register(data: RegisterDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/register", data);
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/login", data);
  }

  async refresh(): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>("/api/auth/refresh");
  }

  async logout(): Promise<{ ok: boolean }> {
    return apiClient.post<{ ok: boolean }>("/api/auth/logout");
  }

  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>("/api/auth/me");
  }

  setAccessToken(token: string | null) {
    apiClient.setAccessToken(token);
  }

  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }
}

export const authService = new AuthService();
