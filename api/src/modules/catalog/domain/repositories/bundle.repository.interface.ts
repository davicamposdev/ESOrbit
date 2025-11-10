import { Bundle } from '../entities/bundle.entity';

export interface IBundleRepository {
  create(data: Bundle): Promise<Bundle>;
  upsert(data: Bundle): Promise<Bundle>;
  findById(id: string): Promise<Bundle | null>;
  findByExternalId(externalId: string): Promise<Bundle | null>;
  findAll(): Promise<Bundle[]>;
  update(id: string, data: Partial<Bundle>): Promise<Bundle | null>;
  delete(id: string): Promise<boolean>;
  createBundleRelation(
    bundleId: string,
    itemId: string,
    description: string,
  ): Promise<void>;
}
