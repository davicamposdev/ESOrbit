import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICosmeticsReadPort } from '../ports/cosmetics-read.port';
import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';

export interface FetchShopParams {
  language?: string;
}

@Injectable()
export class FetchShopUseCase {
  private readonly logger = new Logger(FetchShopUseCase.name);

  constructor(
    @Inject('ICosmeticsReadPort')
    private readonly cosmeticsPort: ICosmeticsReadPort,
  ) {}

  async execute(params: FetchShopParams = {}): Promise<IntegrationCosmetic[]> {
    const language = params.language || 'pt-BR';

    this.logger.log({
      message: 'Fetching shop cosmetics from external API',
      language,
    });

    const cosmetics = await this.cosmeticsPort.fetchShopCosmetics({ language });

    this.logger.log({
      message: 'Shop cosmetics fetched successfully',
      totalCosmetics: cosmetics.length,
    });

    return cosmetics;
  }
}
