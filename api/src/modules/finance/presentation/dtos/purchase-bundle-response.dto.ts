import { PurchaseResponseDto } from './purchase-response.dto';

export class PurchaseBundleResponseDto {
  mainPurchase: PurchaseResponseDto;
  bundleItemsPurchases: PurchaseResponseDto[];
  totalItems: number;
}
