import { TransferStatus } from '../../domain/enums';

export class TransferResponseDto {
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
