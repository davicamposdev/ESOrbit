import { Transfer } from '../entities';
import { TransferStatus } from '../enums';

export interface CreateTransferDto {
  fromUserId: string;
  toUserId: string;
  fromTransactionId: string;
  toTransactionId: string;
  description?: string | null;
}

export interface ITransferRepository {
  create(data: CreateTransferDto): Promise<Transfer>;

  createInTransaction(data: CreateTransferDto, tx: any): Promise<Transfer>;

  findById(id: string): Promise<Transfer | null>;

  updateStatus(id: string, status: TransferStatus): Promise<Transfer>;

  findByUserId(
    userId: string,
    filters?: {
      direction?: 'sent' | 'received' | 'all';
      status?: TransferStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Transfer[]>;
}
