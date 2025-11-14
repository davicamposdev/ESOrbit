import { TransferStatus } from '../enums';

export interface Transfer {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromTransactionId: string;
  toTransactionId: string;
  status: TransferStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TransferEntity implements Transfer {
  constructor(
    public id: string,
    public fromUserId: string,
    public toUserId: string,
    public fromTransactionId: string,
    public toTransactionId: string,
    public status: TransferStatus,
    public description: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(params: {
    fromUserId: string;
    toUserId: string;
    fromTransactionId: string;
    toTransactionId: string;
    description?: string | null;
  }): Omit<Transfer, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      fromUserId: params.fromUserId,
      toUserId: params.toUserId,
      fromTransactionId: params.fromTransactionId,
      toTransactionId: params.toTransactionId,
      status: TransferStatus.PENDING,
      description: params.description || null,
    };
  }

  isPending(): boolean {
    return this.status === TransferStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.status === TransferStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === TransferStatus.FAILED;
  }

  markAsCompleted(): void {
    if (this.isCompleted()) {
      throw new Error('Transfer is already completed');
    }
    if (this.isFailed()) {
      throw new Error('Failed transfers cannot be marked as completed');
    }
    this.status = TransferStatus.COMPLETED;
  }

  markAsFailed(): void {
    if (this.isFailed()) {
      throw new Error('Transfer is already failed');
    }
    if (this.isCompleted()) {
      throw new Error('Completed transfers cannot be marked as failed');
    }
    this.status = TransferStatus.FAILED;
  }

  validate(): void {
    if (!this.fromUserId || !this.toUserId) {
      throw new Error('Transfer must have fromUserId and toUserId');
    }

    if (this.fromUserId === this.toUserId) {
      throw new Error('Cannot transfer to the same user');
    }

    if (!this.fromTransactionId || !this.toTransactionId) {
      throw new Error(
        'Transfer must have fromTransactionId and toTransactionId',
      );
    }
  }
}
