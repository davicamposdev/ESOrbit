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
import { PrismaService } from '../../../../common/database/prisma.service';
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
    private readonly prisma: PrismaService,
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

  @Get('purchases/cosmetics/ids')
  @HttpCode(HttpStatus.OK)
  async getPurchasedCosmeticIds(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ cosmeticIds: string[] }> {
    const purchases = await this.listPurchasesUseCase.execute({
      userId: user.id,
      status: undefined, // Get all active purchases
    });

    const cosmeticIds = purchases
      .filter((p) => p.status === 'ACTIVE')
      .map((p) => p.cosmeticId);

    return { cosmeticIds: Array.from(new Set(cosmeticIds)) };
  }

  @Get('purchases/bundles/ids')
  @HttpCode(HttpStatus.OK)
  async getPurchasedBundleIds(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ bundleIds: string[] }> {
    const purchases = await this.listPurchasesUseCase.execute({
      userId: user.id,
      status: undefined,
    });

    const activePurchaseIds = new Set(
      purchases.filter((p) => p.status === 'ACTIVE').map((p) => p.cosmeticId),
    );

    // Buscar todos os bundles e verificar se todos os cosméticos do bundle foram comprados
    const bundles = await this.prisma.bundle.findMany({
      include: {
        relation: {
          include: {
            cosmetic: true,
          },
        },
      },
    });

    const purchasedBundleIds: string[] = [];

    for (const bundle of bundles) {
      const allCosmeticIds = bundle.relation.map((r) => r.cosmeticId);
      const allPurchased = allCosmeticIds.every((id) =>
        activePurchaseIds.has(id),
      );

      if (allPurchased && allCosmeticIds.length > 0) {
        purchasedBundleIds.push(bundle.id);
      }
    }

    return { bundleIds: purchasedBundleIds };
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
