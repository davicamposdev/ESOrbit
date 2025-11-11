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
  /**
   * Cria uma nova devolução
   */
  create(data: CreateReturnDto): Promise<Return>;

  /**
   * Cria uma nova devolução dentro de uma transação
   */
  createInTransaction(data: CreateReturnDto, tx: any): Promise<Return>;

  /**
   * Busca uma devolução por ID
   */
  findById(id: string): Promise<Return | null>;

  /**
   * Busca devoluções de uma compra
   */
  findByPurchaseId(purchaseId: string): Promise<Return[]>;

  /**
   * Atualiza o status de uma devolução
   */
  updateStatus(id: string, status: ReturnStatus): Promise<Return>;

  /**
   * Lista devoluções de um usuário
   */
  findByUserId(
    userId: string,
    filters?: {
      status?: ReturnStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Return[]>;
}
