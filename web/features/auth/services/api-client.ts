const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];
  private refreshPromise: Promise<string> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private onRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string | null) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async refreshToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha ao renovar token");
    }

    const data = await response.json();
    return data.accessToken;
  }

  private shouldAttemptRefresh(endpoint: string): boolean {
    const authEndpoints = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/refresh",
      "/api/auth/logout",
    ];
    return !authEndpoints.some((path) => endpoint.includes(path));
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 && this.shouldAttemptRefresh(endpoint)) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            this.refreshPromise = this.refreshToken()
              .then((newToken) => {
                this.setAccessToken(newToken);
                if (typeof window !== "undefined") {
                  localStorage.setItem("accessToken", newToken);
                }
                this.onRefreshed(newToken);
                return newToken;
              })
              .catch((error) => {
                this.setAccessToken(null);
                if (typeof window !== "undefined") {
                  localStorage.removeItem("accessToken");
                }
                this.onRefreshed(null);
                throw error;
              })
              .finally(() => {
                this.isRefreshing = false;
                this.refreshPromise = null;
              });

            try {
              await this.refreshPromise;
              return this.request<T>(endpoint, options);
            } catch (refreshError) {
              throw new Error("Sessão expirada. Faça login novamente.");
            }
          } else {
            return new Promise<T>((resolve, reject) => {
              this.addRefreshSubscriber((token: string | null) => {
                if (token) {
                  this.request<T>(endpoint, options)
                    .then(resolve)
                    .catch(reject);
                } else {
                  reject(new Error("Sessão expirada. Faça login novamente."));
                }
              });
            });
          }
        }

        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || "Erro na requisição");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro desconhecido na requisição");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
