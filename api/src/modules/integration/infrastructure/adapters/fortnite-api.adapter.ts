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
      const response = await this.httpClient.get<unknown>(
        `/cosmetics?language=${language}`,
      );

      const validated = SchemaGuard.validateCosmeticsResponse(response);

      // Extract the array from the first available language key
      // The API returns data with language keys (e.g., { br: [...] })
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
      const response = await this.httpClient.get<unknown>(
        `/cosmetics/new?language=${language}`,
      );

      const validated = SchemaGuard.validateNewCosmeticsResponse(response);

      return validated.data.items.map((dto) =>
        CosmeticMapper.toIntegrationCosmetic(dto),
      );
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

  private async checkRateLimit(): Promise<void> {
    const { rateLimitRps } = this.config.get();
    await this.rateLimiter.acquire('fortnite-api', rateLimitRps, rateLimitRps);
  }
}
