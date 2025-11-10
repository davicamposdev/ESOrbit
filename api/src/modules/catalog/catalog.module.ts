import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../../common/database/prisma.module';
import { IntegrationModule } from '../integration/integration.module';
import { PrismaCosmeticRepository } from './infrastructure/repositories/prisma-cosmetic.repository';
import { PrismaBundleRepository } from './infrastructure/repositories/prisma-bundle.repository';
import { PrismaSyncLogRepository } from './infrastructure/repositories/prisma-sync-log.repository';
import { CosmeticSyncService } from './domain/services/cosmetic-sync.service';
import { SyncCosmeticsUseCase } from './application/use-cases/sync-cosmetics.use-case';
import { SyncNewCosmeticsUseCase } from './application/use-cases/sync-new-cosmetics.use-case';
import { SyncShopCosmeticsUseCase } from './application/use-cases/sync-shop-cosmetics.use-case';
import { ListCosmeticsUseCase } from './application/use-cases/list-cosmetics.use-case';
import { CatalogController } from './presentation/controllers/catalog.controller';
import { CatalogSyncCronService } from './application/services/catalog-sync-cron.service';
import { CatalogBootstrapService } from './application/services/catalog-bootstrap.service';

@Module({
  imports: [PrismaModule, IntegrationModule, ScheduleModule.forRoot()],
  controllers: [CatalogController],
  providers: [
    // Repositories
    {
      provide: 'ICosmeticRepository',
      useClass: PrismaCosmeticRepository,
    },
    {
      provide: 'IBundleRepository',
      useClass: PrismaBundleRepository,
    },
    {
      provide: 'ISyncLogRepository',
      useClass: PrismaSyncLogRepository,
    },

    // Use Cases
    SyncCosmeticsUseCase,
    SyncNewCosmeticsUseCase,
    SyncShopCosmeticsUseCase,
    ListCosmeticsUseCase,
    // Domain services
    CosmeticSyncService,
    // Application services
    CatalogBootstrapService,
    CatalogSyncCronService,
  ],
  exports: [
    SyncCosmeticsUseCase,
    SyncNewCosmeticsUseCase,
    SyncShopCosmeticsUseCase,
    ListCosmeticsUseCase,
  ],
})
export class CatalogModule {}
