import { ReturnStatus } from '../../domain/enums';

export class ReturnResponseDto {
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
