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
  bundleItemsPurchases: Purchase[];
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
    // Busca o bundle e seus itens
    const bundle = await this.prisma.bundle.findUnique({
      where: { id: input.bundleId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!bundle) {
      throw new NotFoundException('Bundle not found');
    }

    // Verifica se há itens no bundle
    if (!bundle.items || bundle.items.length === 0) {
      throw new BadRequestException('Bundle has no items');
    }

    // Calcula o preço total do bundle (soma dos itens disponíveis)
    let totalPrice = 0;
    const availableItems: Array<{
      id: string;
      itemId: string;
      bundleId: string;
      description: string;
    }> = [];

    for (const bundleItem of bundle.items) {
      if (bundleItem.item.isAvailable) {
        if (
          !bundleItem.item.currentPrice ||
          bundleItem.item.currentPrice <= 0
        ) {
          throw new BadRequestException(
            `Item "${bundleItem.item.name}" does not have a valid price`,
          );
        }
        totalPrice += bundleItem.item.currentPrice;
        availableItems.push({
          id: bundleItem.id,
          itemId: bundleItem.itemId,
          bundleId: bundleItem.bundleId,
          description: bundleItem.description,
        });
      }
    }

    if (availableItems.length === 0) {
      throw new BadRequestException('Bundle has no available items');
    }

    // Busca o usuário para verificar saldo
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verifica se o usuário tem saldo suficiente
    if (user.credits < totalPrice) {
      throw new BadRequestException('Insufficient credits');
    }

    // Executa a compra do bundle em uma transação atômica
    const result = await this.prisma.$transaction(async (tx) => {
      // Cria a transação principal
      const transaction = await tx.transaction.create({
        data: {
          amount: totalPrice,
          currency: 'credits',
          method: 'purchase',
          type: TransactionType.PURCHASE,
          status: TransactionStatus.COMPLETED,
        },
      });

      // Debita os créditos do usuário
      await tx.user.update({
        where: { id: input.userId },
        data: {
          credits: {
            decrement: totalPrice,
          },
        },
      });

      // Cria compras individuais para cada item disponível do bundle
      const bundleItemsPurchases: any[] = [];
      let firstPurchase: any = null;

      for (const bundleItem of availableItems) {
        // Verifica se o usuário já possui o item individualmente
        const existingItemPurchase = await tx.purchase.findUnique({
          where: {
            userId_cosmeticId: {
              userId: input.userId,
              cosmeticId: bundleItem.itemId,
            },
          },
        });

        // Só cria a compra se o usuário não possuir o item
        if (
          !existingItemPurchase ||
          existingItemPurchase.status !== PurchaseStatus.ACTIVE
        ) {
          const itemPurchase = await tx.purchase.create({
            data: {
              userId: input.userId,
              cosmeticId: bundleItem.itemId,
              transactionId: transaction.id,
              isFromBundle: true,
              parentPurchaseId: firstPurchase ? firstPurchase.id : null,
              status: PurchaseStatus.ACTIVE,
            },
          });

          bundleItemsPurchases.push(itemPurchase);

          // A primeira compra será considerada a "principal"
          if (!firstPurchase) {
            firstPurchase = itemPurchase;
          }
        }
      }

      return {
        mainPurchase: firstPurchase,
        bundleItemsPurchases,
      };
    });

    return {
      mainPurchase: {
        id: result.mainPurchase.id,
        userId: result.mainPurchase.userId,
        cosmeticId: result.mainPurchase.cosmeticId,
        transactionId: result.mainPurchase.transactionId,
        isFromBundle: result.mainPurchase.isFromBundle,
        parentPurchaseId: result.mainPurchase.parentPurchaseId,
        status: result.mainPurchase.status as unknown as PurchaseStatus,
        returnedAt: result.mainPurchase.returnedAt,
        createdAt: result.mainPurchase.createdAt,
        updatedAt: result.mainPurchase.updatedAt,
      },
      bundleItemsPurchases: result.bundleItemsPurchases.map((purchase) => ({
        id: purchase.id,
        userId: purchase.userId,
        cosmeticId: purchase.cosmeticId,
        transactionId: purchase.transactionId,
        isFromBundle: purchase.isFromBundle,
        parentPurchaseId: purchase.parentPurchaseId,
        status: purchase.status as unknown as PurchaseStatus,
        returnedAt: purchase.returnedAt,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      })),
    };
  }
}
