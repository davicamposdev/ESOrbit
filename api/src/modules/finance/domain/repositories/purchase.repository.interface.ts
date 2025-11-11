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
  /**
   * Cria uma nova compra
   */
  create(data: CreatePurchaseDto): Promise<Purchase>;

  /**
   * Cria uma nova compra dentro de uma transação
   */
  createInTransaction(data: CreatePurchaseDto, tx: any): Promise<Purchase>;

  /**
   * Busca uma compra por ID
   */
  findById(id: string): Promise<Purchase | null>;

  /**
   * Busca uma compra por usuário e cosmético
   */
  findByUserAndCosmetic(
    userId: string,
    cosmeticId: string,
  ): Promise<Purchase | null>;

  /**
   * Atualiza o status de uma compra
   */
  updateStatus(id: string, status: PurchaseStatus): Promise<Purchase>;

  /**
   * Marca uma compra como devolvida
   */
  markAsReturned(id: string): Promise<Purchase>;

  /**
   * Lista compras de um usuário
   */
  findByUserId(
    userId: string,
    filters?: {
      status?: PurchaseStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Purchase[]>;

  /**
   * Lista compras filhas de um bundle
   */
  findBundleChildren(parentPurchaseId: string): Promise<Purchase[]>;
}
