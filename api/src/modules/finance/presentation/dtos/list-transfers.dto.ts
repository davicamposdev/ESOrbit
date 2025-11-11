import { IsOptional, IsEnum, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { TransferStatus } from '../../domain/enums';

export class ListTransfersDto {
  @IsOptional()
  @IsIn(['sent', 'received', 'all'])
  direction?: 'sent' | 'received' | 'all';

  @IsOptional()
  @IsEnum(TransferStatus)
  status?: TransferStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
