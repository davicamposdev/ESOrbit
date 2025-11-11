import { IsUUID } from 'class-validator';

export class PurchaseBundleDto {
  @IsUUID()
  bundleId: string;
}
