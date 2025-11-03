# Exemplos de Uso - Integration Module

Este documento mostra exemplos práticos de como usar o módulo de integração.

## 1. Health Check Simples

```typescript
import { Injectable } from '@nestjs/common';
import { HealthCheckUseCase } from '../integration/application/use-cases/health-check.use-case';

@Injectable()
export class SystemHealthService {
  constructor(private readonly healthCheck: HealthCheckUseCase) {}

  async checkIntegrationHealth() {
    const result = await this.healthCheck.execute();

    if (result.status === 'healthy') {
      console.log(`Integration API is healthy (${result.latency}ms)`);
    } else {
      console.error('Integration API is down!');
    }

    return result;
  }
}
```

## 2. Sincronizar Novos Cosméticos (Catalog)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { FetchNewCosmeticsUseCase } from '../integration/application/use-cases/fetch-new-cosmetics.use-case';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class SyncNewCosmeticsUseCase {
  private readonly logger = new Logger(SyncNewCosmeticsUseCase.name);

  constructor(
    private readonly fetchNewCosmetics: FetchNewCosmeticsUseCase,
    private readonly prisma: PrismaService,
  ) {}

  async execute() {
    this.logger.log('Starting sync of new cosmetics');

    // Buscar novos cosméticos da integração (sem side-effects)
    const newCosmetics = await this.fetchNewCosmetics.execute();

    this.logger.log(`Found ${newCosmetics.length} new cosmetics`);

    // Processar e salvar no catálogo (responsabilidade do catalog)
    let savedCount = 0;

    for (const cosmetic of newCosmetics) {
      const exists = await this.prisma.cosmetic.findUnique({
        where: { externalId: cosmetic.externalId },
      });

      if (!exists) {
        await this.prisma.cosmetic.create({
          data: {
            externalId: cosmetic.externalId,
            name: cosmetic.name,
            description: cosmetic.description,
            type: cosmetic.type,
            rarity: cosmetic.rarity,
            imageUrl: cosmetic.imageUrl,
            addedAt: new Date(cosmetic.addedAt),
            isNew: true, // Lógica do catalog
          },
        });
        savedCount++;
      }
    }

    this.logger.log(`Saved ${savedCount} new cosmetics to catalog`);

    return { total: newCosmetics.length, saved: savedCount };
  }
}
```

## 3. Bootstrap Completo do Catálogo

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { FetchAllCosmeticsUseCase } from '../integration/application/use-cases/fetch-all-cosmetics.use-case';
import { PrismaService } from '../common/database/prisma.service';

@Injectable()
export class BootstrapCatalogUseCase {
  private readonly logger = new Logger(BootstrapCatalogUseCase.name);

  constructor(
    private readonly fetchAllCosmetics: FetchAllCosmeticsUseCase,
    private readonly prisma: PrismaService,
  ) {}

  async execute() {
    this.logger.log('Starting catalog bootstrap');

    let totalProcessed = 0;
    let totalSaved = 0;

    // A API retorna tudo de uma vez, fazemos paginação em memória
    const pageSize = 100;
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await this.fetchAllCosmetics.execute({
        language: 'pt-BR',
        page: currentPage,
        pageSize,
      });

      totalProcessed += result.items.length;

      // Processar batch
      const savedInBatch = await this.processBatch(result.items);
      totalSaved += savedInBatch;

      this.logger.log({
        message: 'Batch processed',
        page: currentPage,
        totalPages: result.totalPages,
        processed: totalProcessed,
        saved: totalSaved,
      });

      hasMore = currentPage < result.totalPages;
      currentPage++;
    }

    this.logger.log({
      message: 'Bootstrap completed',
      totalProcessed,
      totalSaved,
    });

    return { totalProcessed, totalSaved };
  }

  private async processBatch(cosmetics: any[]): Promise<number> {
    let saved = 0;

    for (const cosmetic of cosmetics) {
      const exists = await this.prisma.cosmetic.findUnique({
        where: { externalId: cosmetic.externalId },
      });

      if (!exists) {
        await this.prisma.cosmetic.create({
          data: {
            externalId: cosmetic.externalId,
            name: cosmetic.name,
            description: cosmetic.description,
            type: cosmetic.type,
            rarity: cosmetic.rarity,
            imageUrl: cosmetic.imageUrl,
            addedAt: new Date(cosmetic.addedAt),
          },
        });
        saved++;
      }
    }

    return saved;
  }
}
```

## 4. Scheduled Job (Cron)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FetchNewCosmeticsUseCase } from '../integration/application/use-cases/fetch-new-cosmetics.use-case';

@Injectable()
export class CosmeticsScheduler {
  private readonly logger = new Logger(CosmeticsScheduler.name);

  constructor(private readonly fetchNewCosmetics: FetchNewCosmeticsUseCase) {}

  // A cada 45 minutos
  @Cron('*/45 * * * *')
  async syncNewCosmetics() {
    this.logger.log('Running scheduled sync of new cosmetics');

    try {
      const cosmetics = await this.fetchNewCosmetics.execute();

      // Processar cosmetics...

      this.logger.log(`Sync completed: ${cosmetics.length} cosmetics`);
    } catch (error) {
      this.logger.error('Sync failed', error);
    }
  }
}
```

## 5. Tratamento de Erros

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { FetchNewCosmeticsUseCase } from '../integration/application/use-cases/fetch-new-cosmetics.use-case';
import {
  ProviderUnavailableError,
  ProviderTimeoutError,
  SchemaValidationError,
  RateLimitError,
} from '../integration/domain/errors/integration.errors';

@Injectable()
export class ResilientSyncService {
  private readonly logger = new Logger(ResilientSyncService.name);

  constructor(private readonly fetchNewCosmetics: FetchNewCosmeticsUseCase) {}

  async syncWithRetry() {
    try {
      const cosmetics = await this.fetchNewCosmetics.execute();
      return { success: true, data: cosmetics };
    } catch (error) {
      if (error instanceof ProviderUnavailableError) {
        this.logger.warn('Provider unavailable, will retry later');
        return { success: false, retry: true };
      }

      if (error instanceof ProviderTimeoutError) {
        this.logger.warn('Request timeout, will retry later');
        return { success: false, retry: true };
      }

      if (error instanceof RateLimitError) {
        this.logger.warn('Rate limit exceeded, backing off');
        return { success: false, retry: true, backoff: true };
      }

      if (error instanceof SchemaValidationError) {
        this.logger.error('Schema validation failed - provider API changed!');
        // Enviar alerta para equipe
        return { success: false, retry: false };
      }

      throw error;
    }
  }
}
```

## 6. Monitoramento de Métricas

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MetricsService } from '../integration/infrastructure/observability/metrics.service';

@Injectable()
export class MetricsMonitor {
  private readonly logger = new Logger(MetricsMonitor.name);

  constructor(private readonly metrics: MetricsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  logMetrics() {
    const summary = this.metrics.getSummary();

    this.logger.log({
      message: 'Metrics summary',
      metrics: summary,
    });

    // Verificar se há muitos erros
    const httpRequests = summary['integration_http_requests_total'] || {};

    for (const [key, count] of Object.entries(httpRequests)) {
      if (key.includes('status_code=5')) {
        this.logger.error(`High server error rate: ${key} = ${count}`);
      }
    }
  }
}
```

## 7. Cache Simples (Opcional)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { FetchNewCosmeticsUseCase } from '../integration/application/use-cases/fetch-new-cosmetics.use-case';
import { IntegrationCosmetic } from '../integration/domain/entities/integration-cosmetic.entity';

@Injectable()
export class CachedCosmeticsService {
  private readonly logger = new Logger(CachedCosmeticsService.name);
  private cache: IntegrationCosmetic[] | null = null;
  private cacheTime: number = 0;
  private readonly TTL = 60_000; // 60 segundos

  constructor(private readonly fetchNewCosmetics: FetchNewCosmeticsUseCase) {}

  async getNewCosmetics(): Promise<IntegrationCosmetic[]> {
    const now = Date.now();

    if (this.cache && now - this.cacheTime < this.TTL) {
      this.logger.debug('Returning cached cosmetics');
      return this.cache;
    }

    this.logger.log('Cache miss, fetching fresh data');
    this.cache = await this.fetchNewCosmetics.execute();
    this.cacheTime = now;

    return this.cache;
  }
}
```

## 8. Exportar para Uso Externo

No `catalog.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { IntegrationModule } from '../integration/integration.module';
import { SyncNewCosmeticsUseCase } from './use-cases/sync-new-cosmetics.use-case';
import { BootstrapCatalogUseCase } from './use-cases/bootstrap-catalog.use-case';

@Module({
  imports: [IntegrationModule],
  providers: [SyncNewCosmeticsUseCase, BootstrapCatalogUseCase],
  exports: [SyncNewCosmeticsUseCase, BootstrapCatalogUseCase],
})
export class CatalogModule {}
```

## Comandos de Teste

```bash
# Testar health check
curl http://localhost:4000/api/integration/health

# Testar novos cosméticos
curl http://localhost:4000/api/integration/cosmetics/new | jq

# Testar paginação
curl "http://localhost:4000/api/integration/cosmetics/paginated?maxPages=2&pageSize=10" | jq

# Ver métricas
curl http://localhost:4000/api/integration/metrics | jq

# Ver métricas formato Prometheus
curl http://localhost:4000/api/integration/metrics/prometheus
```
