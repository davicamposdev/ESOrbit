import { PurchaseStatus } from '../enums';

export interface Purchase {
  id: string;
  userId: string;
  cosmeticId: string;
  transactionId: string;
  isFromBundle: boolean;
  parentPurchaseId: string | null;
  status: PurchaseStatus;
  returnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseEntity implements Purchase {
  constructor(
    public id: string,
    public userId: string,
    public cosmeticId: string,
    public transactionId: string,
    public isFromBundle: boolean,
    public parentPurchaseId: string | null,
    public status: PurchaseStatus,
    public returnedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: {
    userId: string;
    cosmeticId: string;
    transactionId: string;
    isFromBundle?: boolean;
    parentPurchaseId?: string | null;
  }): Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      userId: params.userId,
      cosmeticId: params.cosmeticId,
      transactionId: params.transactionId,
      isFromBundle: params.isFromBundle || false,
      parentPurchaseId: params.parentPurchaseId || null,
      status: PurchaseStatus.ACTIVE,
      returnedAt: null,
    };
  }

  /**
   * Verifica se a compra está ativa
   */
  isActive(): boolean {
    return this.status === PurchaseStatus.ACTIVE;
  }

  /**
   * Verifica se a compra foi devolvida
   */
  isReturned(): boolean {
    return this.status === PurchaseStatus.RETURNED;
  }

  /**
   * Verifica se a compra foi cancelada
   */
  isCancelled(): boolean {
    return this.status === PurchaseStatus.CANCELLED;
  }

  /**
   * Verifica se a compra pode ser devolvida
   */
  canBeReturned(): boolean {
    return this.status === PurchaseStatus.ACTIVE;
  }

  /**
   * Marca a compra como devolvida
   */
  markAsReturned(): void {
    if (!this.canBeReturned()) {
      throw new Error(
        'Purchase cannot be returned. Only active purchases can be returned.',
      );
    }
    this.status = PurchaseStatus.RETURNED;
    this.returnedAt = new Date();
  }

  /**
   * Cancela a compra
   */
  cancel(): void {
    if (!this.isActive()) {
      throw new Error('Only active purchases can be cancelled');
    }
    this.status = PurchaseStatus.CANCELLED;
  }

  /**
   * Valida a consistência da compra
   */
  validate(): void {
    if (!this.userId || !this.cosmeticId || !this.transactionId) {
      throw new Error(
        'Purchase must have userId, cosmeticId, and transactionId',
      );
    }

    if (this.isFromBundle && !this.parentPurchaseId) {
      throw new Error('Bundle purchases must have a parentPurchaseId');
    }
  }
}
