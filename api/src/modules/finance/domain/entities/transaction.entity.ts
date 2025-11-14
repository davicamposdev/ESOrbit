import { TransactionType, TransactionStatus } from '../enums';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  method: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
}

export class TransactionEntity implements Transaction {
  constructor(
    public id: string,
    public amount: number,
    public currency: string,
    public method: string,
    public type: TransactionType,
    public status: TransactionStatus,
    public createdAt: Date,
  ) {}

  static create(params: {
    amount: number;
    currency: string;
    method: string;
    type: TransactionType;
    status?: TransactionStatus;
  }): Omit<Transaction, 'id' | 'createdAt'> {
    return {
      amount: params.amount,
      currency: params.currency,
      method: params.method,
      type: params.type,
      status: params.status || TransactionStatus.PENDING,
    };
  }

  isValidAmount(): boolean {
    return this.amount > 0;
  }

  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  markAsCompleted(): void {
    if (this.status === TransactionStatus.COMPLETED) {
      throw new Error('Transaction is already completed');
    }
    this.status = TransactionStatus.COMPLETED;
  }

  markAsFailed(): void {
    if (this.status === TransactionStatus.FAILED) {
      throw new Error('Transaction is already failed');
    }
    this.status = TransactionStatus.FAILED;
  }
}
