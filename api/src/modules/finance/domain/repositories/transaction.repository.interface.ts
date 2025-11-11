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
  /**
   * Cria uma nova transação
   */
  create(data: CreateTransactionDto): Promise<Transaction>;

  /**
   * Busca uma transação por ID
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Atualiza o status de uma transação
   */
  updateStatus(id: string, status: TransactionStatus): Promise<Transaction>;

  /**
   * Lista transações com filtros
   */
  findMany(filters?: {
    type?: TransactionType;
    status?: TransactionStatus;
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]>;
}
