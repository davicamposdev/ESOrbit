import { ReturnStatus } from '../enums';

export interface Return {
  id: string;
  purchaseId: string;
  userId: string;
  cosmeticId: string;
  transactionId: string;
  reason: string | null;
  isPartial: boolean;
  status: ReturnStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ReturnEntity implements Return {
  constructor(
    public id: string,
    public purchaseId: string,
    public userId: string,
    public cosmeticId: string,
    public transactionId: string,
    public reason: string | null,
    public isPartial: boolean,
    public status: ReturnStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: {
    purchaseId: string;
    userId: string;
    cosmeticId: string;
    transactionId: string;
    reason?: string | null;
    isPartial?: boolean;
  }): Omit<Return, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      purchaseId: params.purchaseId,
      userId: params.userId,
      cosmeticId: params.cosmeticId,
      transactionId: params.transactionId,
      reason: params.reason || null,
      isPartial: params.isPartial || false,
      status: ReturnStatus.PENDING,
    };
  }

  /**
   * Verifica se a devolução está pendente
   */
  isPending(): boolean {
    return this.status === ReturnStatus.PENDING;
  }

  /**
   * Verifica se a devolução foi completada
   */
  isCompleted(): boolean {
    return this.status === ReturnStatus.COMPLETED;
  }

  /**
   * Verifica se a devolução falhou
   */
  isFailed(): boolean {
    return this.status === ReturnStatus.FAILED;
  }

  /**
   * Marca a devolução como completa
   */
  markAsCompleted(): void {
    if (this.isCompleted()) {
      throw new Error('Return is already completed');
    }
    if (this.isFailed()) {
      throw new Error('Failed returns cannot be marked as completed');
    }
    this.status = ReturnStatus.COMPLETED;
  }

  /**
   * Marca a devolução como falha
   */
  markAsFailed(): void {
    if (this.isFailed()) {
      throw new Error('Return is already failed');
    }
    if (this.isCompleted()) {
      throw new Error('Completed returns cannot be marked as failed');
    }
    this.status = ReturnStatus.FAILED;
  }

  /**
   * Valida a consistência da devolução
   */
  validate(): void {
    if (
      !this.purchaseId ||
      !this.userId ||
      !this.cosmeticId ||
      !this.transactionId
    ) {
      throw new Error(
        'Return must have purchaseId, userId, cosmeticId, and transactionId',
      );
    }
  }
}
