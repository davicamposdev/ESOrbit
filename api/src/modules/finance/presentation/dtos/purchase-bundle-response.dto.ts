import { PurchaseResponseDto } from './purchase-response.dto';

export class PurchaseBundleResponseDto {
  mainPurchase: PurchaseResponseDto;
  bundleCosmeticsPurchases: PurchaseResponseDto[];
  totalCosmetics: number;
}
