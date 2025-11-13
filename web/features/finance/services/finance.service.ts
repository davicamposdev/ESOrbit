import { apiClient } from "@/features/auth/services/api-client";

export interface PurchaseResponse {
  id: string;
  userId: string;
  cosmeticId: string;
  transactionId: string;
  isFromBundle: boolean;
  parentPurchaseId: string | null;
  status: string;
  returnedAt: string | null;
  createdAt: string;
  updatedAt: string;
  cosmetic?: {
    id: string;
    name: string;
    description: string;
    type: string;
    rarity: string;
    imageUrl: string;
    regularPrice: number;
    finalPrice: number;
    onSale: boolean;
    isAvailable: boolean;
  };
  transaction?: {
    id: string;
    userId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
  };
}

export interface PurchaseBundleResponse {
  mainPurchase: PurchaseResponse;
  bundleItemsPurchases: PurchaseResponse[];
  totalItems: number;
}

export interface TransferResponse {
  id: string;
  fromUserId: string;
  toUserId: string;
  transactionId: string;
  description?: string;
  createdAt: string;
  transaction?: {
    id: string;
    amount: number;
    type: string;
    status: string;
  };
}

export interface ListPurchasesParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ListTransfersParams {
  direction?: "sent" | "received";
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ReturnCosmeticResponse {
  id: string;
  purchaseId: string;
  userId: string;
  cosmeticId: string;
  transactionId: string;
  reason?: string;
  isPartial: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class FinanceService {
  async purchaseCosmetic(cosmeticId: string): Promise<PurchaseResponse> {
    return apiClient.post<PurchaseResponse>("/api/finance/purchases", {
      cosmeticId,
    });
  }

  async purchaseBundle(bundleId: string): Promise<PurchaseBundleResponse> {
    return apiClient.post<PurchaseBundleResponse>(
      "/api/finance/purchases/bundle",
      {
        bundleId,
      }
    );
  }

  async listPurchases(
    params?: ListPurchasesParams
  ): Promise<PurchaseResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const query = searchParams.toString();
    return apiClient.get<PurchaseResponse[]>(
      `/api/finance/purchases${query ? `?${query}` : ""}`
    );
  }

  async listTransfers(
    params?: ListTransfersParams
  ): Promise<TransferResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.direction) searchParams.append("direction", params.direction);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const query = searchParams.toString();
    return apiClient.get<TransferResponse[]>(
      `/api/finance/transfers${query ? `?${query}` : ""}`
    );
  }

  async returnCosmetic(
    purchaseId: string,
    reason?: string
  ): Promise<ReturnCosmeticResponse> {
    return apiClient.post<ReturnCosmeticResponse>("/api/finance/returns", {
      purchaseId,
      reason,
    });
  }
}

export const financeService = new FinanceService();
