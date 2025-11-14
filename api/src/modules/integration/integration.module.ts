import { Module, OnModuleInit } from '@nestjs/common';
import { IntegrationConfigService } from './infrastructure/config/integration-config.service';
import { HttpClientService } from './infrastructure/http/http-client.service';
import { RateLimiterService } from './infrastructure/resilience/rate-limiter.service';
import { CircuitBreakerService } from './infrastructure/resilience/circuit-breaker.service';
import { MetricsService } from './infrastructure/observability/metrics.service';
import { FortniteApiAdapter } from './infrastructure/adapters/fortnite-api.adapter';
import { FetchAllCosmeticsUseCase } from './application/use-cases/fetch-all-cosmetics.use-case';
import { FetchNewCosmeticsUseCase } from './application/use-cases/fetch-new-cosmetics.use-case';
import { FetchShopUseCase } from './application/use-cases/fetch-shop.use-case';
import { HealthCheckUseCase } from './application/use-cases/health-check.use-case';
import { CosmeticMapper } from './infrastructure/mappers/cosmetic.mapper';
import { IntegrationController } from './presentation/controllers/integration.controller';

@Module({
  controllers: [IntegrationController],
  providers: [
    IntegrationConfigService,

    HttpClientService,
    RateLimiterService,
    CircuitBreakerService,
    MetricsService,

    {
      provide: 'ICosmeticsReadPort',
      useClass: FortniteApiAdapter,
    },

    FetchAllCosmeticsUseCase,
    FetchNewCosmeticsUseCase,
    FetchShopUseCase,
    HealthCheckUseCase,
  ],
  exports: [
    FetchAllCosmeticsUseCase,
    FetchNewCosmeticsUseCase,
    FetchShopUseCase,
    HealthCheckUseCase,
    MetricsService,
  ],
})
export class IntegrationModule implements OnModuleInit {
  constructor(private readonly metricsService: MetricsService) {}

  onModuleInit() {
    CosmeticMapper.setMetricsService(this.metricsService);
  }
}
