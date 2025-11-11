import { Injectable, Logger } from '@nestjs/common';
import { FetchNewCosmeticsUseCase } from '../../../integration/application/use-cases/fetch-new-cosmetics.use-case';
import { CosmeticSyncService } from '../../domain/services/cosmetic-sync.service';

export interface SyncNewCosmeticsResult {
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  duration: number;
}

@Injectable()
export class SyncNewCosmeticsUseCase {
  private readonly logger = new Logger(SyncNewCosmeticsUseCase.name);
  constructor(
    private readonly fetchNewCosmeticsUseCase: FetchNewCosmeticsUseCase,
    private readonly cosmeticSyncService: CosmeticSyncService,
  ) {}

  async execute(language = 'pt-BR'): Promise<SyncNewCosmeticsResult> {
    const startTime = Date.now();

    this.logger.log('Starting new cosmetics synchronization');

    const newCosmetics = await this.fetchNewCosmeticsUseCase.execute({
      language,
    });

    this.logger.log(
      `Fetched ${newCosmetics.length} new cosmetics from external API`,
    );

    const syncResult = await this.cosmeticSyncService.processCosmeticsBatch(
      newCosmetics,
      {
        updateIsNew: true,
        updateIsAvailable: false,
        updatePricing: false,
        isNewValue: true,
      },
    );

    const duration = Date.now() - startTime;

    this.logger.log({
      message: 'New cosmetics synchronization completed',
      itemsProcessed: newCosmetics.length,
      itemsCreated: syncResult.itemsCreated,
      itemsUpdated: syncResult.itemsUpdated,
      duration,
    });

    return {
      itemsProcessed: newCosmetics.length,
      itemsCreated: syncResult.itemsCreated,
      itemsUpdated: syncResult.itemsUpdated,
      duration,
    };
  }
}
