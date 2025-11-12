import { Inject, Injectable, Logger } from '@nestjs/common';
import type {
  ICosmeticRepository,
  FindManyParams,
} from '../../domain/repositories/cosmetic.repository.interface';
import { Cosmetic } from '../../domain/entities/cosmetic.entity';

export interface ListCosmeticsParams {
  type?: string;
  rarity?: string;
  isNew?: boolean;
  isAvailable?: boolean;
  isBundle?: boolean;
  onSale?: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  page?: number;
  pageSize?: number;
}

export interface ListCosmeticsResult {
  items: Cosmetic[];
  page: number;
  pageSize: number;
  total: number;
}

@Injectable()
export class ListCosmeticsUseCase {
  private readonly logger = new Logger(ListCosmeticsUseCase.name);

  constructor(
    @Inject('ICosmeticRepository')
    private readonly cosmeticRepository: ICosmeticRepository,
  ) {}

  async execute(
    params: ListCosmeticsParams = {},
  ): Promise<ListCosmeticsResult> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 50;
    const offset = (page - 1) * pageSize;

    const repositoryParams: FindManyParams = {
      type: params.type,
      rarity: params.rarity,
      isNew: params.isNew,
      isAvailable: params.isAvailable,
      isBundle: params.isBundle,
      onSale: params.onSale,
      createdFrom: params.createdFrom,
      createdTo: params.createdTo,
      limit: pageSize,
      offset,
    };

    const items = await this.cosmeticRepository.findMany(repositoryParams);

    const allItems = await this.cosmeticRepository.findMany({
      type: params.type,
      rarity: params.rarity,
      isNew: params.isNew,
      isAvailable: params.isAvailable,
      isBundle: params.isBundle,
      onSale: params.onSale,
      createdFrom: params.createdFrom,
      createdTo: params.createdTo,
    });

    return {
      items,
      page,
      pageSize,
      total: allItems.length,
    };
  }
}
