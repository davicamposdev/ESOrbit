import { apiClient } from "@/features/auth/services/api-client";

export interface Cosmetic {
  id: string;
  externalId: string;
  name: string;
  type: string;
  rarity: string;
  imageUrl: string;
  addedAt: string;
  isNew: boolean;
  isAvailable: boolean;
  basePrice: number | null;
  currentPrice: number | null;
  onSale: boolean;
  isBundle: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCosmeticsParams {
  type?: string;
  rarity?: string;
  isNew?: boolean;
  onSale?: boolean;
  isBundle?: boolean;
  isAvailable?: boolean;
  createdFrom?: string | Date;
  createdTo?: string | Date;
  page?: number;
  pageSize?: number;
}

export interface ListCosmeticsResponse {
  data: Cosmetic[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SyncCosmeticsDto {
  language?: string;
}

export interface SyncResponse {
  message: string;
  stats?: {
    processed: number;
    created: number;
    updated: number;
  };
}

export class CatalogService {
  async listCosmetics(
    params: ListCosmeticsParams = {}
  ): Promise<ListCosmeticsResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/catalog/cosmetics${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get<ListCosmeticsResponse>(endpoint);
  }

  async syncAll(data: SyncCosmeticsDto = {}): Promise<SyncResponse> {
    return apiClient.post<SyncResponse>("/api/catalog/sync/all", data);
  }

  async syncNew(data: SyncCosmeticsDto = {}): Promise<SyncResponse> {
    return apiClient.post<SyncResponse>("/api/catalog/sync/new", data);
  }

  async syncShop(data: SyncCosmeticsDto = {}): Promise<SyncResponse> {
    return apiClient.post<SyncResponse>("/api/catalog/sync/shop", data);
  }

  async syncFull(data: SyncCosmeticsDto = {}): Promise<SyncResponse> {
    return apiClient.post<SyncResponse>("/api/catalog/sync/full", data);
  }
}

export const catalogService = new CatalogService();
