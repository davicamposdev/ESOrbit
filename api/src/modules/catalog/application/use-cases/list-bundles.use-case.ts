import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IBundleRepository } from '../../domain/repositories/bundle.repository.interface';
import type { ICosmeticRepository } from '../../domain/repositories/cosmetic.repository.interface';
import { Bundle } from '../../domain/entities/bundle.entity';
import { Cosmetic } from '../../domain/entities/cosmetic.entity';

export interface BundleWithCosmetics {
  bundle: Bundle;
  cosmetics: Cosmetic[];
}

export interface ListBundlesParams {
  isAvailable?: boolean;
  onSale?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ListBundlesResult {
  items: BundleWithCosmetics[];
  page: number;
  pageSize: number;
  total: number;
}

@Injectable()
export class ListBundlesUseCase {
  private readonly logger = new Logger(ListBundlesUseCase.name);

  constructor(
    @Inject('IBundleRepository')
    private readonly bundleRepository: IBundleRepository,
    @Inject('ICosmeticRepository')
    private readonly cosmeticRepository: ICosmeticRepository,
  ) {}

  async execute(params: ListBundlesParams = {}): Promise<ListBundlesResult> {
    const bundles = await this.bundleRepository.findAll();

    if (bundles.length === 0) {
      return {
        items: [],
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        total: 0,
      };
    }

    const allCosmeticIds = bundles.flatMap(({ cosmeticIds }) => cosmeticIds);
    const cosmeticsMap =
      await this.cosmeticRepository.findManyByIds(allCosmeticIds);

    const bundlesWithDetails = bundles
      .map(({ bundle, cosmeticIds }) => {
        const cosmetics = cosmeticIds
          .map((cosmeticId) => cosmeticsMap.get(cosmeticId))
          .filter((cosmetic): cosmetic is Cosmetic => cosmetic !== null);

        if (cosmetics.length === 0) {
          this.logger.warn(
            `No cosmetics found for bundle ${bundle.name} (${bundle.id})`,
          );
          return null;
        }

        if (params.isAvailable) {
          const allMatch = cosmetics.every(
            (c) => c.isAvailable === params.isAvailable,
          );
          if (!allMatch) return null;
        }

        if (params.onSale) {
          const anyMatch = cosmetics.some((c) => c.onSale === params.onSale);
          if (!anyMatch) return null;
        }

        return {
          bundle,
          cosmetics,
        };
      })
      .filter((item): item is BundleWithCosmetics => item !== null);

    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    const paginatedBundles = bundlesWithDetails.slice(
      offset,
      offset + pageSize,
    );

    return {
      items: paginatedBundles,
      page,
      pageSize,
      total: bundlesWithDetails.length,
    };
  }
}
