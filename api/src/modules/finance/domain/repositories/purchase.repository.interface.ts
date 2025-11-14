import { Purchase } from '../entities';
import { PurchaseStatus } from '../enums';

export interface CreatePurchaseDto {
  userId: string;
  cosmeticId: string;
  transactionId: string;
  isFromBundle?: boolean;
  parentPurchaseId?: string | null;
}

export interface ITransactionContext {
  $transaction: <T>(fn: (tx: any) => Promise<T>) => Promise<T>;
}

export interface IPurchaseRepository {
  create(data: CreatePurchaseDto): Promise<Purchase>;

  createInTransaction(data: CreatePurchaseDto, tx: any): Promise<Purchase>;

  findById(id: string): Promise<Purchase | null>;

  findByUserAndCosmetic(
    userId: string,
    cosmeticId: string,
  ): Promise<Purchase | null>;

  updateStatus(id: string, status: PurchaseStatus): Promise<Purchase>;

  markAsReturned(id: string): Promise<Purchase>;

  findByUserId(
    userId: string,
    filters?: {
      status?: PurchaseStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Purchase[]>;

  findBundleChildren(parentPurchaseId: string): Promise<Purchase[]>;
}
