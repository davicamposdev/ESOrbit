import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cosmetic } from '../entities/cosmetic.entity';
import { Bundle } from '../entities/bundle.entity';
import type { ICosmeticRepository } from '../repositories/cosmetic.repository.interface';
import type { IBundleRepository } from '../repositories/bundle.repository.interface';

export interface IntegrationCosmetic {
  externalId: string;
  name: string;
  type: string;
  rarity: string;
  imageUrl: string;
  addedAt: string;
  setInfo?: {
    backendValue: string;
    value: string;
    text: string;
  };
  basePrice?: number;
  currentPrice?: number;
}

export interface SyncResult {
  itemsCreated: number;
  itemsUpdated: number;
}

export interface SyncOptions {
  updateIsNew?: boolean;
  updateIsAvailable?: boolean;
  updatePricing?: boolean;
  isNewValue?: boolean;
}

@Injectable()
export class CosmeticSyncService {
  private readonly logger = new Logger(CosmeticSyncService.name);

  constructor(
    @Inject('ICosmeticRepository')
    private readonly cosmeticRepository: ICosmeticRepository,
    @Inject('IBundleRepository')
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async processCosmetic(
    integrationCosmetic: IntegrationCosmetic,
    options: SyncOptions = {},
  ): Promise<void> {
    const isBundle = integrationCosmetic.setInfo !== undefined;

    const isAvailable =
      integrationCosmetic.basePrice !== undefined &&
      integrationCosmetic.basePrice !== null &&
      integrationCosmetic.basePrice > 0 &&
      integrationCosmetic.currentPrice !== undefined &&
      integrationCosmetic.currentPrice !== null &&
      integrationCosmetic.currentPrice > 0;

    if (
      !isAvailable &&
      (integrationCosmetic.basePrice !== undefined ||
        integrationCosmetic.currentPrice !== undefined)
    ) {
      this.logger.debug(
        `Item ${integrationCosmetic.name} (${integrationCosmetic.externalId}) não está disponível: preço inválido (base: ${integrationCosmetic.basePrice}, current: ${integrationCosmetic.currentPrice})`,
      );
    }

    const cosmetic = Cosmetic.create(
      integrationCosmetic.externalId,
      integrationCosmetic.name,
      integrationCosmetic.type,
      integrationCosmetic.rarity,
      integrationCosmetic.imageUrl,
      new Date(integrationCosmetic.addedAt),
      options.isNewValue ?? false,
      isAvailable,
      integrationCosmetic.basePrice ?? null,
      integrationCosmetic.currentPrice ?? null,
      isBundle,
    );

    const savedCosmetic = await this.cosmeticRepository.upsert(
      cosmetic,
      options,
    );

    if (isBundle) {
      await this.processBundleRelation(
        integrationCosmetic.setInfo!,
        savedCosmetic.id,
      );
    }
  }

  async processCosmeticsBatch(
    cosmetics: IntegrationCosmetic[],
    options: SyncOptions = {},
  ): Promise<SyncResult> {
    const BATCH_SIZE = 300;
    let itemsCreated = 0;
    let itemsUpdated = 0;

    for (let i = 0; i < cosmetics.length; i += BATCH_SIZE) {
      const batch = cosmetics.slice(i, i + BATCH_SIZE);

      const externalIds = batch.map((c) => c.externalId);
      const existingCosmetics =
        await this.cosmeticRepository.findManyByExternalIds(externalIds);

      const results = await Promise.all(
        batch.map(async (cosmetic) => {
          const exists = existingCosmetics.has(cosmetic.externalId);
          await this.processCosmetic(cosmetic, options);
          return { created: !exists };
        }),
      );

      results.forEach((result) => {
        if (result.created) {
          itemsCreated++;
        } else {
          itemsUpdated++;
        }
      });

      this.logger.debug(
        `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(cosmetics.length / BATCH_SIZE)} (${batch.length} items)`,
      );
    }

    this.logger.log({
      message: 'Batch processing completed',
      itemsCreated,
      itemsUpdated,
      total: cosmetics.length,
    });

    return {
      itemsCreated,
      itemsUpdated,
    };
  }

  private async processBundleRelation(
    setInfo: { backendValue: string; value: string; text: string },
    cosmeticId: string,
  ): Promise<void> {
    const newBundle = Bundle.create(setInfo.backendValue, setInfo.value);
    const bundle = await this.bundleRepository.upsert(newBundle);

    await this.bundleRepository.createBundleRelation(
      bundle.id,
      cosmeticId,
      setInfo.text,
    );
  }
}
