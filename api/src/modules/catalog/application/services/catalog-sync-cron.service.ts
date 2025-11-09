import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { ISyncLogRepository } from '../../domain/repositories/sync-log.repository.interface.';
import { SyncCosmeticsUseCase } from '../use-cases/sync-cosmetics.use-case';
import { SyncNewCosmeticsUseCase } from '../use-cases/sync-new-cosmetics.use-case';
import { SyncShopCosmeticsUseCase } from '../use-cases/sync-shop-cosmetics.use-case';

@Injectable()
export class CatalogSyncCronService {
  private readonly logger = new Logger(CatalogSyncCronService.name);

  constructor(
    @Inject('ISyncLogRepository')
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly syncCosmeticsUseCase: SyncCosmeticsUseCase,
    private readonly syncNewCosmeticsUseCase: SyncNewCosmeticsUseCase,
    private readonly syncShopCosmeticsUseCase: SyncShopCosmeticsUseCase,
  ) {}

  @Cron('0 3 * * *', {
    name: 'full-catalog-sync',
    timeZone: 'America/Sao_Paulo',
  })
  async handleFullCatalogSync() {
    const startedAt = new Date();
    const startTime = Date.now();

    this.logger.log('Iniciando sincronização completa automática...');

    const { id: logId } = await this.syncLogRepository.create({
      job: 'full-catalog-sync-auto',
      status: 'running',
      message: 'Sincronização automática iniciada',
      startedAt,
    });

    try {
      const [allResult, newResult, shopResult] = await Promise.all([
        this.syncCosmeticsUseCase.execute('pt-BR'),
        this.syncNewCosmeticsUseCase.execute('pt-BR'),
        this.syncShopCosmeticsUseCase.execute('pt-BR'),
      ]);

      const duration = Date.now() - startTime;
      const totalProcessed =
        allResult.itemsProcessed +
        newResult.itemsProcessed +
        shopResult.itemsProcessed;
      const totalCreated =
        allResult.itemsCreated +
        newResult.itemsCreated +
        shopResult.itemsCreated;
      const totalUpdated =
        allResult.itemsUpdated +
        newResult.itemsUpdated +
        shopResult.itemsUpdated;

      await this.syncLogRepository.update(logId, {
        status: 'success',
        message: 'Sincronização automática concluída com sucesso',
        itemsProcessed: totalProcessed,
        itemsCreated: totalCreated,
        itemsUpdated: totalUpdated,
        duration,
        finishedAt: new Date(),
      });

      this.logger.log(
        `Sincronização automática concluída: ${totalProcessed} processados, ${totalCreated} criados, ${totalUpdated} atualizados em ${duration}ms`,
      );
    } catch (error) {
      const duration = Date.now() - startTime;

      await this.syncLogRepository.update(logId, {
        status: 'failed',
        message: `Erro: ${error.message}`,
        duration,
        finishedAt: new Date(),
      });

      this.logger.error(
        `Erro na sincronização automática: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
