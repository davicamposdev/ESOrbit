import { apiClient } from "@/features/auth/services/api-client";

export interface PurchaseResponse {
  id: string;
  userId: string;
  cosmeticId: string;
  transactionId: string;
  status: string;
  createdAt: string;
}

export interface PurchaseBundleResponse {
  mainPurchase: PurchaseResponse;
  bundleItemsPurchases: PurchaseResponse[];
  totalItems: number;
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
}

export const financeService = new FinanceService();
