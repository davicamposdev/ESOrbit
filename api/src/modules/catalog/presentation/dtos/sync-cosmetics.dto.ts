import { IsOptional, IsString } from 'class-validator';

export class SyncCosmeticsDto {
  @IsOptional()
  @IsString()
  language?: string;
}
