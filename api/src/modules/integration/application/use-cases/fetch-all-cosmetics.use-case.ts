import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICosmeticsReadPort } from '../ports/cosmetics-read.port';
import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';

export interface FetchAllCosmeticsParams {
  language?: string;
  page?: number;
  pageSize?: number;
  skipPagination?: boolean;
}

export interface CosmeticsResult {
  items: IntegrationCosmetic[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class FetchAllCosmeticsUseCase {
  private readonly logger = new Logger(FetchAllCosmeticsUseCase.name);

  constructor(
    @Inject('ICosmeticsReadPort')
    private readonly cosmeticsPort: ICosmeticsReadPort,
  ) {}

  async execute(
    params: FetchAllCosmeticsParams = {},
  ): Promise<CosmeticsResult> {
    const language = params.language || 'pt-BR';
    const page = params.page || 1;
    const pageSize = params.pageSize || 100;
    const skipPagination = params.skipPagination || false;

    this.logger.log({
      message: 'Fetching all cosmetics from external API',
      language,
    });

    const allCosmetics = await this.cosmeticsPort.fetchAllCosmetics({
      language,
    });

    this.logger.log({
      message: 'Cosmetics fetched successfully',
      totalCosmetics: allCosmetics.length,
    });

    if (skipPagination) {
      return {
        items: allCosmetics,
        total: allCosmetics.length,
        page: 1,
        pageSize: allCosmetics.length,
        totalPages: 1,
      };
    }

    const totalPages = Math.ceil(allCosmetics.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = allCosmetics.slice(startIndex, endIndex);

    return {
      items,
      total: allCosmetics.length,
      page,
      pageSize,
      totalPages,
    };
  }
}
