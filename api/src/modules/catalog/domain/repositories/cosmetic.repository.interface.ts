import type { Cosmetic } from '../entities/cosmetic.entity';

export interface UpsertOptions {
  updateIsNew?: boolean;
  updateIsAvailable?: boolean;
  updatePricing?: boolean;
}

export interface ICosmeticRepository {
  findById(id: string): Promise<Cosmetic | null>;
  findByExternalId(externalId: string): Promise<Cosmetic | null>;
  findMany(params?: FindManyParams): Promise<Cosmetic[]>;
  findManyByIds(ids: string[]): Promise<Map<string, Cosmetic>>;
  create(cosmetic: Cosmetic): Promise<Cosmetic>;
  update(cosmetic: Cosmetic, options?: UpsertOptions): Promise<Cosmetic>;
  findManyByExternalIds(externalIds: string[]): Promise<Map<string, Cosmetic>>;
}

export interface FindManyParams {
  type?: string;
  rarity?: string;
  isNew?: boolean;
  isAvailable?: boolean;
  isBundle?: boolean;
  onSale?: boolean;
  createdFrom?: Date;
  createdTo?: Date;
  limit?: number;
  offset?: number;
}
