import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';

export interface FetchCosmeticsParams {
  language?: string;
}

export interface ICosmeticsReadPort {
  fetchAllCosmetics(
    params?: FetchCosmeticsParams,
  ): Promise<IntegrationCosmetic[]>;

  fetchNewCosmetics(
    params?: FetchCosmeticsParams,
  ): Promise<IntegrationCosmetic[]>;

  fetchShopCosmetics(
    params?: FetchCosmeticsParams,
  ): Promise<IntegrationCosmetic[]>;

  pingCosmetics(): Promise<{ latency: number; status: string }>;
}
