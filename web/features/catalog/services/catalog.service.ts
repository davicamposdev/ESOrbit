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

export interface BundleItem {
  id: string;
  externalId: string;
  name: string;
  type: string;
  rarity: string;
  imageUrl: string;
  basePrice: number | null;
  currentPrice: number | null;
}

export interface Bundle {
  id: string;
  externalId: string;
  name: string;
  cosmetic: {
    id: string;
    externalId: string;
    name: string;
    imageUrl: string;
    isAvailable: boolean;
    basePrice: number | null;
    currentPrice: number | null;
    onSale: boolean;
    isNew: boolean;
    rarity: string;
    type: string;
    addedAt: string;
  } | null;
  items: BundleItem[];
}

export interface ListCosmeticsParams {
  name?: string;
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

export interface ListBundlesParams {
  isAvailable?: boolean;
  onSale?: boolean;
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

export interface ListBundlesResponse {
  data: Bundle[];
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

  async listBundles(
    params: ListBundlesParams = {}
  ): Promise<ListBundlesResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/api/catalog/bundles${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get<ListBundlesResponse>(endpoint);
  }

  async getPurchasedCosmeticIds(): Promise<string[]> {
    const response = await apiClient.get<{ cosmeticIds: string[] }>(
      "/api/finance/purchases/cosmetics/ids"
    );
    return response.cosmeticIds;
  }

  async getPurchasedBundleIds(): Promise<string[]> {
    const response = await apiClient.get<{ bundleIds: string[] }>(
      "/api/finance/purchases/bundles/ids"
    );
    return response.bundleIds;
  }
}

export const catalogService = new CatalogService();
