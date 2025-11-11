import { IsUUID, IsOptional, IsString } from 'class-validator';

export class ReturnCosmeticDto {
  @IsUUID()
  purchaseId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
