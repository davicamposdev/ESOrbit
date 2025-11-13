import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../auth/domain/entities/user.entity';
import {
  PurchaseCosmeticUseCase,
  PurchaseBundleUseCase,
  ReturnCosmeticUseCase,
  TransferCreditsUseCase,
  ListPurchasesUseCase,
  ListTransfersUseCase,
} from '../../application/use-cases';
import {
  PurchaseCosmeticDto,
  PurchaseBundleDto,
  ReturnCosmeticDto,
  TransferCreditsDto,
  ListPurchasesDto,
  ListTransfersDto,
  PurchaseResponseDto,
  PurchaseBundleResponseDto,
  ReturnResponseDto,
  TransferResponseDto,
} from '../dtos';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(
    private readonly purchaseCosmeticUseCase: PurchaseCosmeticUseCase,
    private readonly purchaseBundleUseCase: PurchaseBundleUseCase,
    private readonly returnCosmeticUseCase: ReturnCosmeticUseCase,
    private readonly transferCreditsUseCase: TransferCreditsUseCase,
    private readonly listPurchasesUseCase: ListPurchasesUseCase,
    private readonly listTransfersUseCase: ListTransfersUseCase,
  ) {}

  @Post('purchases')
  @HttpCode(HttpStatus.CREATED)
  async purchaseCosmetic(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PurchaseCosmeticDto,
  ): Promise<PurchaseResponseDto> {
    return this.purchaseCosmeticUseCase.execute({
      userId: user.id,
      cosmeticId: dto.cosmeticId,
    });
  }

  @Post('purchases/bundle')
  @HttpCode(HttpStatus.CREATED)
  async purchaseBundle(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PurchaseBundleDto,
  ): Promise<PurchaseBundleResponseDto> {
    const result = await this.purchaseBundleUseCase.execute({
      userId: user.id,
      bundleId: dto.bundleId,
    });

    return {
      mainPurchase: result.mainPurchase,
      bundleCosmeticsPurchases: result.bundleCosmeticsPurchases,
      totalCosmetics: result.bundleCosmeticsPurchases.length,
    };
  }

  @Get('purchases')
  @HttpCode(HttpStatus.OK)
  async listPurchases(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListPurchasesDto,
  ): Promise<PurchaseResponseDto[]> {
    return this.listPurchasesUseCase.execute({
      userId: user.id,
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Post('returns')
  @HttpCode(HttpStatus.CREATED)
  async returnCosmetic(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReturnCosmeticDto,
  ): Promise<ReturnResponseDto> {
    return this.returnCosmeticUseCase.execute({
      userId: user.id,
      purchaseId: dto.purchaseId,
      reason: dto.reason,
    });
  }

  @Post('transfers')
  @HttpCode(HttpStatus.CREATED)
  async transferCredits(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TransferCreditsDto,
  ): Promise<TransferResponseDto> {
    return this.transferCreditsUseCase.execute({
      fromUserId: user.id,
      toUserId: dto.toUserId,
      amount: dto.amount,
      description: dto.description,
    });
  }

  @Get('transfers')
  @HttpCode(HttpStatus.OK)
  async listTransfers(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTransfersDto,
  ): Promise<TransferResponseDto[]> {
    return this.listTransfersUseCase.execute({
      userId: user.id,
      direction: query.direction,
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });
  }
}
