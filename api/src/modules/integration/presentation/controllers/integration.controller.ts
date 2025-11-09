import { Controller, Get, Query, Logger } from '@nestjs/common';
import { FetchAllCosmeticsUseCase } from '../../application/use-cases/fetch-all-cosmetics.use-case';
import { FetchNewCosmeticsUseCase } from '../../application/use-cases/fetch-new-cosmetics.use-case';
import { FetchShopUseCase } from '../../application/use-cases/fetch-shop.use-case';
import { HealthCheckUseCase } from '../../application/use-cases/health-check.use-case';
import { MetricsService } from '../../infrastructure/observability/metrics.service';
import { Public } from '../../../auth/presentation/decorators/public.decorator';

@Public()
@Controller('integration')
export class IntegrationController {
  private readonly logger = new Logger(IntegrationController.name);

  constructor(
    private readonly fetchAllCosmeticsUseCase: FetchAllCosmeticsUseCase,
    private readonly fetchNewUseCase: FetchNewCosmeticsUseCase,
    private readonly fetchShopUseCase: FetchShopUseCase,
    private readonly healthCheckUseCase: HealthCheckUseCase,
    private readonly metricsService: MetricsService,
  ) {}

  @Get('health')
  async health() {
    return this.healthCheckUseCase.execute();
  }

  @Get('cosmetics/new')
  async getNewCosmetics(@Query('language') language?: string) {
    return this.fetchNewUseCase.execute({ language });
  }

  @Get('cosmetics')
  async getCosmetics(
    @Query('language') language?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.fetchAllCosmeticsUseCase.execute({
      language,
      page: page ? parseInt(String(page), 10) : undefined,
      pageSize: pageSize ? parseInt(String(pageSize), 10) : undefined,
    });
  }

  @Get('shop')
  async getShop(@Query('language') language?: string) {
    return this.fetchShopUseCase.execute({ language });
  }

  @Get('metrics')
  getMetrics() {
    return this.metricsService.getSummary();
  }

  @Get('metrics/prometheus')
  getPrometheusMetrics() {
    return this.metricsService.getMetrics();
  }
}
