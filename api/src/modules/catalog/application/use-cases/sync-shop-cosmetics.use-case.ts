import { Injectable, Logger } from '@nestjs/common';
import { FetchShopUseCase } from '../../../integration/application/use-cases/fetch-shop.use-case';
import { CosmeticSyncService } from '../../domain/services/cosmetic-sync.service';

export interface SyncShopCosmeticsResult {
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  duration: number;
}

@Injectable()
export class SyncShopCosmeticsUseCase {
  private readonly logger = new Logger(SyncShopCosmeticsUseCase.name);

  constructor(
    private readonly fetchShopUseCase: FetchShopUseCase,
    private readonly cosmeticSyncService: CosmeticSyncService,
  ) {}

  async execute(language = 'pt-BR'): Promise<SyncShopCosmeticsResult> {
    const startTime = Date.now();

    this.logger.log('Starting shop cosmetics synchronization');

    const shopCosmetics = await this.fetchShopUseCase.execute({
      language,
    });

    this.logger.log(
      `Fetched ${shopCosmetics.length} shop cosmetics from external API`,
    );

    const syncResult = await this.cosmeticSyncService.processCosmeticsBatch(
      shopCosmetics,
      {
        updateIsNew: false,
        updateIsAvailable: true,
        updatePricing: true,
      },
    );

    const duration = Date.now() - startTime;

    this.logger.log({
      message: 'Shop cosmetics synchronization completed',
      itemsProcessed: shopCosmetics.length,
      itemsCreated: syncResult.itemsCreated,
      itemsUpdated: syncResult.itemsUpdated,
      duration,
    });

    return {
      itemsProcessed: shopCosmetics.length,
      itemsCreated: syncResult.itemsCreated,
      itemsUpdated: syncResult.itemsUpdated,
      duration,
    };
  }
}
