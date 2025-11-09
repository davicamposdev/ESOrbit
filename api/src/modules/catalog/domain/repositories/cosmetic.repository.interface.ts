import type { Cosmetic } from '../entities/cosmetic.entity';

export interface UpsertOptions {
  updateIsNew?: boolean;
  updateIsAvailable?: boolean;
}

export interface ICosmeticRepository {
  findByExternalId(externalId: string): Promise<Cosmetic | null>;
  findMany(params?: FindManyParams): Promise<Cosmetic[]>;
  upsert(cosmetic: Cosmetic, options?: UpsertOptions): Promise<Cosmetic>;
  findManyByExternalIds(externalIds: string[]): Promise<Map<string, Cosmetic>>;
}

export interface FindManyParams {
  type?: string;
  rarity?: string;
  isNew?: boolean;
  isAvailable?: boolean;
  isBundle?: boolean;
  limit?: number;
  offset?: number;
}
