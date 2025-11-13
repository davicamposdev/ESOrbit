import { Bundle } from '../entities/bundle.entity';

export interface BundleWithCosmeticIds {
  bundle: Bundle;
  cosmeticIds: string[];
}

export interface IBundleRepository {
  create(data: Bundle): Promise<Bundle>;
  findByExternalId(externalId: string): Promise<Bundle | null>;
  findAll(): Promise<BundleWithCosmeticIds[]>;
  update(id: string, name: string): Promise<Bundle>;
  createBundleRelation(
    bundleId: string,
    cosmeticId: string,
    description: string,
  ): Promise<void>;
}
