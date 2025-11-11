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
  /**
   * Cria uma nova transferência
   */
  create(data: CreateTransferDto): Promise<Transfer>;

  /**
   * Cria uma nova transferência dentro de uma transação
   */
  createInTransaction(data: CreateTransferDto, tx: any): Promise<Transfer>;

  /**
   * Busca uma transferência por ID
   */
  findById(id: string): Promise<Transfer | null>;

  /**
   * Atualiza o status de uma transferência
   */
  updateStatus(id: string, status: TransferStatus): Promise<Transfer>;

  /**
   * Lista transferências de um usuário
   */
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
