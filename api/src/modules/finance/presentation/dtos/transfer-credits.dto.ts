import { IsUUID, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class TransferCreditsDto {
  @IsUUID()
  toUserId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
