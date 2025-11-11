import { IsUUID } from 'class-validator';

export class PurchaseCosmeticDto {
  @IsUUID()
  cosmeticId: string;
}
