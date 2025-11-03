import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICosmeticsReadPort } from '../ports/cosmetics-read.port';
import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';

export interface FetchNewCosmeticsParams {
  language?: string;
}

@Injectable()
export class FetchNewCosmeticsUseCase {
  private readonly logger = new Logger(FetchNewCosmeticsUseCase.name);

  constructor(
    @Inject('ICosmeticsReadPort')
    private readonly cosmeticsPort: ICosmeticsReadPort,
  ) {}

  async execute(
    params: FetchNewCosmeticsParams = {},
  ): Promise<IntegrationCosmetic[]> {
    const language = params.language || 'pt-BR';

    this.logger.log({
      message: 'Fetching new cosmetics',
      language,
    });

    const cosmetics = await this.cosmeticsPort.fetchNewCosmetics({ language });

    this.logger.log({
      message: 'New cosmetics fetched',
      count: cosmetics.length,
    });

    return cosmetics;
  }
}
