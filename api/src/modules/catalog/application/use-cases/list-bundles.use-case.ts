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
    this.logger.log(`Found ${bundles.length} bundles`);

    if (bundles.length === 0) {
      return {
        items: [],
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        total: 0,
      };
    }

    // Busca todos os cosméticos que fazem parte dos bundles
    const allCosmeticIds = bundles.flatMap(({ cosmeticIds }) => cosmeticIds);
    const cosmeticsMap =
      await this.cosmeticRepository.findManyByIds(allCosmeticIds);

    this.logger.log(`Found ${cosmeticsMap.size} cosmetics for all bundles`);

    // Monta os bundles com seus cosméticos
    const bundlesWithDetails = bundles
      .map(({ bundle, cosmeticIds }) => {
        // Busca os cosméticos deste bundle
        const cosmetics = cosmeticIds
          .map((cosmeticId) => cosmeticsMap.get(cosmeticId))
          .filter((cosmetic): cosmetic is Cosmetic => cosmetic !== null);

        if (cosmetics.length === 0) {
          this.logger.warn(
            `No cosmetics found for bundle ${bundle.name} (${bundle.id})`,
          );
          return null;
        }

        // Aplica filtros (verifica se PELO MENOS UM cosmético atende aos critérios)
        if (params.isAvailable !== undefined) {
          const hasAvailable = cosmetics.some(
            (c) => c.isAvailable === params.isAvailable,
          );
          if (!hasAvailable) return null;
        }

        if (params.onSale !== undefined) {
          const hasOnSale = cosmetics.some((c) => c.onSale === params.onSale);
          if (!hasOnSale) return null;
        }

        return {
          bundle,
          cosmetics,
        };
      })
      .filter((item): item is BundleWithCosmetics => item !== null);

    this.logger.log(
      `After filtering, ${bundlesWithDetails.length} bundles remain`,
    );

    // Paginação
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const offset = (page - 1) * pageSize;

    const paginatedBundles = bundlesWithDetails.slice(
      offset,
      offset + pageSize,
    );

    this.logger.log(
      `Returning ${paginatedBundles.length} bundles (page ${page}, total: ${bundlesWithDetails.length})`,
    );

    this.logger.log('Paginated bundles:', paginatedBundles);

    return {
      items: paginatedBundles,
      page,
      pageSize,
      total: bundlesWithDetails.length,
    };
  }
}
