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
  ): Promise<{ wasCreated: boolean; wasUpdated: boolean }> {
    const isBundle = integrationCosmetic.setInfo !== undefined;

    const isAvailable =
      integrationCosmetic.basePrice !== undefined &&
      integrationCosmetic.basePrice !== null &&
      integrationCosmetic.basePrice > 0 &&
      integrationCosmetic.currentPrice !== undefined &&
      integrationCosmetic.currentPrice !== null &&
      integrationCosmetic.currentPrice > 0;

    const onSale =
      integrationCosmetic.basePrice !== undefined &&
      integrationCosmetic.basePrice !== null &&
      integrationCosmetic.currentPrice !== undefined &&
      integrationCosmetic.currentPrice !== null &&
      integrationCosmetic.basePrice > integrationCosmetic.currentPrice;

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
      onSale,
      isBundle,
    );

    const existing = await this.cosmeticRepository.findByExternalId(
      cosmetic.externalId,
    );

    let savedCosmetic: Cosmetic;
    let wasCreated = false;
    let wasUpdated = false;

    if (!existing) {
      savedCosmetic = await this.cosmeticRepository.create(cosmetic);
      wasCreated = true;
    } else {
      const needsUpdate = this.hasChanges(existing, cosmetic, options);

      if (needsUpdate) {
        savedCosmetic = await this.cosmeticRepository.update(cosmetic, options);
        wasUpdated = true;
      } else {
        savedCosmetic = existing;
      }
    }

    if (isBundle) {
      await this.processBundleRelation(
        integrationCosmetic.setInfo!,
        savedCosmetic.id,
      );
    }

    return { wasCreated, wasUpdated };
  }

  async processCosmeticsBatch(
    cosmetics: IntegrationCosmetic[],
    options: SyncOptions = {},
  ): Promise<SyncResult> {
    const BATCH_SIZE = 100;
    let itemsCreated = 0;
    let itemsUpdated = 0;

    for (let i = 0; i < cosmetics.length; i += BATCH_SIZE) {
      const batch = cosmetics.slice(i, i + BATCH_SIZE);

      const results = await Promise.all(
        batch.map((cosmetic) => this.processCosmetic(cosmetic, options)),
      );

      results.forEach((result) => {
        if (result.wasCreated) {
          itemsCreated++;
        } else if (result.wasUpdated) {
          itemsUpdated++;
        }
      });

      const batchCreated = results.filter((r) => r.wasCreated).length;
      const batchUpdated = results.filter((r) => r.wasUpdated).length;
      const batchUnchanged = results.filter(
        (r) => !r.wasCreated && !r.wasUpdated,
      ).length;

      this.logger.debug(
        `Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(cosmetics.length / BATCH_SIZE)}: ${batchCreated} criados, ${batchUpdated} atualizados, ${batchUnchanged} inalterados`,
      );
    }

    const itemsUnchanged = cosmetics.length - itemsCreated - itemsUpdated;

    this.logger.log({
      message: 'Batch processing completed',
      itemsCreated,
      itemsUpdated,
      itemsUnchanged,
      total: cosmetics.length,
    });

    return {
      itemsCreated,
      itemsUpdated,
    };
  }

  private hasChanges(
    existing: Cosmetic,
    cosmetic: Cosmetic,
    options: SyncOptions,
  ): boolean {
    if (
      existing.name !== cosmetic.name ||
      existing.type !== cosmetic.type ||
      existing.rarity !== cosmetic.rarity ||
      existing.imageUrl !== cosmetic.imageUrl ||
      existing.addedAt.getTime() !== cosmetic.addedAt.getTime() ||
      existing.isBundle !== cosmetic.isBundle
    ) {
      return true;
    }

    if (options.updateIsNew !== false && existing.isNew !== cosmetic.isNew) {
      return true;
    }

    if (
      options.updateIsAvailable !== false &&
      existing.isAvailable !== cosmetic.isAvailable
    ) {
      return true;
    }

    if (options.updatePricing === true) {
      if (
        existing.basePrice !== cosmetic.basePrice ||
        existing.currentPrice !== cosmetic.currentPrice ||
        existing.onSale !== cosmetic.onSale
      ) {
        return true;
      }
    }

    return false;
  }

  private async processBundleRelation(
    setInfo: { backendValue: string; value: string; text: string },
    cosmeticId: string,
  ): Promise<void> {
    const newBundle = Bundle.create(setInfo.backendValue, setInfo.value);

    const existing = await this.bundleRepository.findByExternalId(
      newBundle.externalId,
    );

    let bundle: Bundle;

    if (!existing) {
      bundle = await this.bundleRepository.create(newBundle);
    } else if (existing.name !== newBundle.name) {
      bundle = await this.bundleRepository.update(existing.id, newBundle.name);
    } else {
      bundle = existing;
    }

    await this.bundleRepository.createBundleRelation(
      bundle.id,
      cosmeticId,
      setInfo.text,
    );
  }
}
