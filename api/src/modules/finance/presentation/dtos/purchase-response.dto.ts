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
  cosmetic?: {
    id: string;
    name: string;
    description: string;
    type: string;
    rarity: string;
    imageUrl: string;
    regularPrice: number;
    finalPrice: number;
    onSale: boolean;
    isAvailable: boolean;
  };
  transaction?: {
    id: string;
    userId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
  };
}
