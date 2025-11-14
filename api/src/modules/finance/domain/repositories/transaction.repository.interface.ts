import { Transaction } from '../entities';
import { TransactionType, TransactionStatus } from '../enums';

export interface CreateTransactionDto {
  amount: number;
  currency: string;
  method: string;
  type: TransactionType;
  status?: TransactionStatus;
}

export interface ITransactionRepository {
  create(data: CreateTransactionDto): Promise<Transaction>;

  findById(id: string): Promise<Transaction | null>;

  updateStatus(id: string, status: TransactionStatus): Promise<Transaction>;

  findMany(filters?: {
    type?: TransactionType;
    status?: TransactionStatus;
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]>;
}
