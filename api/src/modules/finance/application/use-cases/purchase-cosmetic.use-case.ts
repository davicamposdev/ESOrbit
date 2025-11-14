import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import type {
  ITransactionRepository,
  IPurchaseRepository,
} from '../../domain/repositories';
import {
  TransactionType,
  TransactionStatus,
  PurchaseStatus,
} from '../../domain/enums';
import { Purchase } from '../../domain/entities';

export interface PurchaseCosmeticInput {
  userId: string;
  cosmeticId: string;
}

@Injectable()
export class PurchaseCosmeticUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IPurchaseRepository')
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: PurchaseCosmeticInput): Promise<Purchase> {
    const existingPurchase =
      await this.purchaseRepository.findByUserAndCosmetic(
        input.userId,
        input.cosmeticId,
      );

    if (existingPurchase && existingPurchase.status === PurchaseStatus.ACTIVE) {
      throw new BadRequestException('User already owns this cosmetic');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cosmetic = await this.prisma.cosmetic.findUnique({
      where: { id: input.cosmeticId },
    });

    if (!cosmetic) {
      throw new NotFoundException('Cosmetic not found');
    }

    if (!cosmetic.isAvailable) {
      throw new BadRequestException('Cosmetic is not available for purchase');
    }

    if (!cosmetic.currentPrice || cosmetic.currentPrice <= 0) {
      throw new BadRequestException('Cosmetic does not have a valid price');
    }

    const price = cosmetic.currentPrice;

    if (user.credits < price) {
      throw new BadRequestException('Insufficient credits');
    }

    const purchaseId = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          amount: price,
          currency: 'credits',
          method: 'purchase',
          type: TransactionType.PURCHASE,
          status: TransactionStatus.COMPLETED,
        },
      });

      await tx.user.update({
        where: { id: input.userId },
        data: {
          credits: {
            decrement: price,
          },
        },
      });

      const newPurchase = await tx.purchase.create({
        data: {
          userId: input.userId,
          cosmeticId: input.cosmeticId,
          transactionId: transaction.id,
          isFromBundle: false,
          status: PurchaseStatus.ACTIVE,
        },
      });

      return newPurchase.id;
    });

    const purchase = await this.purchaseRepository.findById(purchaseId);

    if (!purchase) {
      throw new BadRequestException('Failed to retrieve purchase');
    }

    return purchase;
  }
}
