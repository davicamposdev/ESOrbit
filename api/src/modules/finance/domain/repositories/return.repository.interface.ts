import { Return } from '../entities';
import { ReturnStatus } from '../enums';

export interface CreateReturnDto {
  purchaseId: string;
  userId: string;
  cosmeticId: string;
  transactionId: string;
  reason?: string | null;
  isPartial?: boolean;
}

export interface IReturnRepository {
  create(data: CreateReturnDto): Promise<Return>;

  createInTransaction(data: CreateReturnDto, tx: any): Promise<Return>;

  findById(id: string): Promise<Return | null>;

  findByPurchaseId(purchaseId: string): Promise<Return[]>;

  updateStatus(id: string, status: ReturnStatus): Promise<Return>;

  findByUserId(
    userId: string,
    filters?: {
      status?: ReturnStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Return[]>;
}
