import { PurchaseStatus } from '../../domain/enums';

export class PurchaseResponseDto {
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
