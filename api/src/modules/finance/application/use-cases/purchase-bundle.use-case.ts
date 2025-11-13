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

export interface PurchaseBundleInput {
  userId: string;
  bundleId: string;
}

export interface PurchaseBundleOutput {
  mainPurchase: Purchase;
  bundleCosmeticsPurchases: Purchase[];
}

@Injectable()
export class PurchaseBundleUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IPurchaseRepository')
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: PurchaseBundleInput): Promise<PurchaseBundleOutput> {
    const bundle = await this.prisma.bundle.findUnique({
      where: { id: input.bundleId },
      include: {
        relation: {
          include: {
            cosmetic: true,
          },
        },
      },
    });

    if (!bundle) {
      throw new NotFoundException('Bundle not found');
    }

    if (!bundle.relation || bundle.relation.length === 0) {
      throw new BadRequestException('Bundle has no cosmetics');
    }

    let totalPrice = 0;
    const availableCosmetics: Array<{
      id: string;
      cosmeticId: string;
      bundleId: string;
      description: string;
    }> = [];

    for (const bundleCosmetic of bundle.relation) {
      if (bundleCosmetic.cosmetic.isAvailable) {
        if (
          !bundleCosmetic.cosmetic.currentPrice ||
          bundleCosmetic.cosmetic.currentPrice <= 0
        ) {
          throw new BadRequestException(
            `Cosmetic "${bundleCosmetic.cosmetic.name}" does not have a valid price`,
          );
        }
        totalPrice += bundleCosmetic.cosmetic.currentPrice;
        availableCosmetics.push({
          id: bundleCosmetic.id,
          cosmeticId: bundleCosmetic.cosmeticId,
          bundleId: bundleCosmetic.bundleId,
          description: bundleCosmetic.description,
        });
      }
    }

    if (availableCosmetics.length === 0) {
      throw new BadRequestException('Bundle has no available cosmetics');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.credits < totalPrice) {
      throw new BadRequestException('Insufficient credits');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          amount: totalPrice,
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
            decrement: totalPrice,
          },
        },
      });

      const bundleCosmeticsPurchases: any[] = [];
      let firstPurchase: any = null;

      for (const bundleCosmetic of availableCosmetics) {
        const existingCosmeticPurchase = await tx.purchase.findUnique({
          where: {
            userId_cosmeticId: {
              userId: input.userId,
              cosmeticId: bundleCosmetic.cosmeticId,
            },
          },
        });

        if (
          !existingCosmeticPurchase ||
          existingCosmeticPurchase.status !== PurchaseStatus.ACTIVE
        ) {
          const cosmeticPurchase = await tx.purchase.create({
            data: {
              userId: input.userId,
              cosmeticId: bundleCosmetic.cosmeticId,
              transactionId: transaction.id,
              isFromBundle: true,
              parentPurchaseId: firstPurchase ? firstPurchase.id : null,
              status: PurchaseStatus.ACTIVE,
            },
          });

          bundleCosmeticsPurchases.push(cosmeticPurchase);

          if (!firstPurchase) {
            firstPurchase = cosmeticPurchase;
          }
        }
      }

      return {
        mainPurchaseId: firstPurchase.id,
        bundleCosmeticsPurchaseIds: bundleCosmeticsPurchases.map((p) => p.id),
      };
    });

    // Busca as compras completas com dados relacionados
    const mainPurchase = await this.purchaseRepository.findById(
      result.mainPurchaseId,
    );

    if (!mainPurchase) {
      throw new BadRequestException('Failed to retrieve main purchase');
    }

    const bundleCosmeticsPurchases = await Promise.all(
      result.bundleCosmeticsPurchaseIds.map((id) =>
        this.purchaseRepository.findById(id),
      ),
    );

    return {
      mainPurchase,
      bundleCosmeticsPurchases: bundleCosmeticsPurchases.filter(
        (p): p is Purchase => p !== null,
      ),
    };
  }
}
