import { Injectable, Logger } from '@nestjs/common';
import { FetchAllCosmeticsUseCase } from '../../../integration/application/use-cases/fetch-all-cosmetics.use-case';
import { CosmeticSyncService } from '../../domain/services/cosmetic-sync.service';

export interface SyncCosmeticsResult {
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  duration: number;
}

@Injectable()
export class SyncCosmeticsUseCase {
  private readonly logger = new Logger(SyncCosmeticsUseCase.name);

  constructor(
    private readonly fetchAllCosmeticsUseCase: FetchAllCosmeticsUseCase,
    private readonly cosmeticSyncService: CosmeticSyncService,
  ) {}

  async execute(language = 'pt-BR'): Promise<SyncCosmeticsResult> {
    const startTime = Date.now();

    this.logger.log('Starting cosmetics synchronization');

    const result = await this.fetchAllCosmeticsUseCase.execute({
      language,
      skipPagination: true,
    });

    this.logger.log(`Fetched ${result.total} cosmetics from external API`);

    // sync-all não deve alterar isNew nem isAvailable
    const syncResult = await this.cosmeticSyncService.processCosmeticsBatch(
      result.items,
      {
        updateIsNew: false,
        updateIsAvailable: false,
      },
    );

    const duration = Date.now() - startTime;

    this.logger.log({
      message: 'Cosmetics synchronization completed',
      itemsProcessed: result.total,
      itemsCreated: syncResult.itemsCreated,
      itemsUpdated: syncResult.itemsUpdated,
      duration,
    });

    return {
      itemsProcessed: result.total,
      itemsCreated: syncResult.itemsCreated,
      itemsUpdated: syncResult.itemsUpdated,
      duration,
    };
  }
}
