import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ISyncLogRepository } from '../../domain/repositories/sync-log.repository.interface.';
import { SyncCosmeticsUseCase } from '../use-cases/sync-cosmetics.use-case';
import { SyncNewCosmeticsUseCase } from '../use-cases/sync-new-cosmetics.use-case';
import { SyncShopCosmeticsUseCase } from '../use-cases/sync-shop-cosmetics.use-case';

@Injectable()
export class CatalogBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(CatalogBootstrapService.name);

  constructor(
    @Inject('ISyncLogRepository')
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly syncCosmeticsUseCase: SyncCosmeticsUseCase,
    private readonly syncNewCosmeticsUseCase: SyncNewCosmeticsUseCase,
    private readonly syncShopCosmeticsUseCase: SyncShopCosmeticsUseCase,
  ) {}

  async onModuleInit() {
    const shouldSync = process.env.SYNC_ON_BOOTSTRAP === 'true';

    if (!shouldSync) {
      this.logger.log('Sincronização no bootstrap desabilitada');
      return;
    }

    const startedAt = new Date();
    const startTime = Date.now();

    this.logger.log('Iniciando sincronização inicial do catálogo...');

    const { id: logId } = await this.syncLogRepository.create({
      job: 'full-catalog-sync-bootstrap',
      status: 'running',
      message: 'Sincronização de bootstrap iniciada',
      startedAt,
    });

    try {
      // Executa sincronizações sequencialmente para evitar race conditions
      // no upsert de cosméticos com o mesmo external_id
      this.logger.log('Sincronizando catálogo completo...');
      const allResult = await this.syncCosmeticsUseCase.execute('pt-BR');

      this.logger.log('Sincronizando novos cosméticos...');
      const newResult = await this.syncNewCosmeticsUseCase.execute('pt-BR');

      this.logger.log('Sincronizando loja...');
      const shopResult = await this.syncShopCosmeticsUseCase.execute('pt-BR');

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
        message: 'Sincronização de bootstrap concluída com sucesso',
        itemsProcessed: totalProcessed,
        itemsCreated: totalCreated,
        itemsUpdated: totalUpdated,
        duration,
        finishedAt: new Date(),
      });

      this.logger.log(
        `Sincronização de bootstrap concluída: ${totalProcessed} processados, ${totalCreated} criados, ${totalUpdated} atualizados em ${duration}ms`,
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';

      const isProviderUnavailable =
        error instanceof Error &&
        (error.name === 'ProviderUnavailableError' ||
          error.message.includes('Service Unavailable') ||
          error.message.includes('booting up'));

      if (isProviderUnavailable) {
        this.logger.warn(
          'API externa temporariamente indisponível. A sincronização será executada na próxima execução agendada.',
        );
        this.logger.warn(
          'A aplicação está operacional e continuará funcionando com os dados existentes.',
        );

        await this.syncLogRepository.update(logId, {
          status: 'failed',
          message:
            'API externa indisponível (pode estar inicializando). Sincronização será tentada novamente mais tarde.',
          duration,
          finishedAt: new Date(),
        });
      } else {
        const errorStack = error instanceof Error ? error.stack : undefined;

        await this.syncLogRepository.update(logId, {
          status: 'failed',
          message: `Erro: ${errorMessage}`,
          duration,
          finishedAt: new Date(),
        });

        this.logger.error(
          `Erro na sincronização de bootstrap: ${errorMessage}`,
          errorStack,
        );

        this.logger.warn(
          'A aplicação continuará executando apesar do erro na sincronização',
        );
      }
    }
  }
}
