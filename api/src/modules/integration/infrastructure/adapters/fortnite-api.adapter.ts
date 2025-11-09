import { Injectable, Logger } from '@nestjs/common';
import { ICosmeticsReadPort } from '../../application/ports/cosmetics-read.port';
import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';
import { HttpClientService } from '../http/http-client.service';
import { SchemaGuard } from '../schemas/schema-guard';
import { CosmeticMapper } from '../mappers/cosmetic.mapper';
import { RateLimiterService } from '../resilience/rate-limiter.service';
import { CircuitBreakerService } from '../resilience/circuit-breaker.service';
import { IntegrationConfigService } from '../config/integration-config.service';

@Injectable()
export class FortniteApiAdapter implements ICosmeticsReadPort {
  private readonly logger = new Logger(FortniteApiAdapter.name);

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly rateLimiter: RateLimiterService,
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly config: IntegrationConfigService,
  ) {}

  async fetchAllCosmetics(params?: {
    language?: string;
  }): Promise<IntegrationCosmetic[]> {
    await this.checkRateLimit();

    return this.circuitBreaker.execute('cosmetics_all', async () => {
      const language = params?.language || 'pt-BR';
      const response = await this.httpClient.get<unknown>('/cosmetics', {
        params: { language },
      });

      const validated = SchemaGuard.validateCosmeticsResponse(response);

      const items = Object.values(validated.data)[0] ?? [];
      return items.map((dto) => CosmeticMapper.toIntegrationCosmetic(dto));
    });
  }

  async fetchNewCosmetics(params?: {
    language?: string;
  }): Promise<IntegrationCosmetic[]> {
    await this.checkRateLimit();

    return this.circuitBreaker.execute('cosmetics_new', async () => {
      const language = params?.language || 'pt-BR';
      const response = await this.httpClient.get<unknown>('/cosmetics/new', {
        params: { language },
      });

      const validated = SchemaGuard.validateNewCosmeticsResponse(response);

      const allItems = Object.values(validated.data.items).flat();

      const validItems = allItems.filter((item) =>
        CosmeticMapper.isValidCosmetic(item),
      );

      this.logger.log({
        message: 'Filtering cosmetic items',
        totalItems: allItems.length,
        validItems: validItems.length,
        filtered: allItems.length - validItems.length,
      });

      return validItems.map((dto) => CosmeticMapper.toIntegrationCosmetic(dto));
    });
  }

  async pingCosmetics(): Promise<{ latency: number; status: string }> {
    const startTime = Date.now();

    try {
      await this.httpClient.get<unknown>('/cosmetics/');
      const latency = Date.now() - startTime;

      return { latency, status: 'healthy' };
    } catch (error) {
      const latency = Date.now() - startTime;
      this.logger.error({
        message: 'Health check failed',
        error: error instanceof Error ? error.message : String(error),
      });

      return { latency, status: 'unhealthy' };
    }
  }

  async fetchShopCosmetics(params?: {
    language?: string;
  }): Promise<IntegrationCosmetic[]> {
    await this.checkRateLimit();

    return this.circuitBreaker.execute('shop', async () => {
      const language = params?.language || 'pt-BR';
      const response = await this.httpClient.get<unknown>('/shop', {
        params: { language },
      });

      const validated = SchemaGuard.validateShopResponse(response);

      const allItems = validated.data.entries
        .flatMap((entry) =>
          (entry.brItems || []).map((item) => ({
            ...item,
            basePrice: entry.regularPrice,
            currentPrice: entry.finalPrice,
          })),
        )
        .filter((item) => CosmeticMapper.isValidCosmetic(item));

      this.logger.log({
        message: 'Filtering shop cosmetic items',
        totalEntries: validated.data.entries.length,
        totalItems: validated.data.entries.reduce(
          (acc, entry) => acc + (entry.brItems?.length || 0),
          0,
        ),
        validItems: allItems.length,
        filtered:
          validated.data.entries.reduce(
            (acc, entry) => acc + (entry.brItems?.length || 0),
            0,
          ) - allItems.length,
      });

      return allItems.map((dto) => CosmeticMapper.toIntegrationCosmetic(dto));
    });
  }

  private async checkRateLimit(): Promise<void> {
    const { rateLimitRps } = this.config.get();
    await this.rateLimiter.acquire('fortnite-api', rateLimitRps, rateLimitRps);
  }
}
