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
    // Verifica se o usuário já possui este cosmético
    const existingPurchase =
      await this.purchaseRepository.findByUserAndCosmetic(
        input.userId,
        input.cosmeticId,
      );

    if (existingPurchase && existingPurchase.status === PurchaseStatus.ACTIVE) {
      throw new BadRequestException('User already owns this cosmetic');
    }

    // Busca o usuário para verificar saldo
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Busca o cosmético para validação
    const cosmetic = await this.prisma.cosmetic.findUnique({
      where: { id: input.cosmeticId },
    });

    if (!cosmetic) {
      throw new NotFoundException('Cosmetic not found');
    }

    if (!cosmetic.isAvailable) {
      throw new BadRequestException('Cosmetic is not available for purchase');
    }

    // Valida se o cosmético tem preço definido
    if (!cosmetic.currentPrice || cosmetic.currentPrice <= 0) {
      throw new BadRequestException('Cosmetic does not have a valid price');
    }

    const price = cosmetic.currentPrice;

    // Verifica se o usuário tem saldo suficiente
    if (user.credits < price) {
      throw new BadRequestException('Insufficient credits');
    }

    // Executa a compra em uma transação atômica
    const purchase = await this.prisma.$transaction(async (tx) => {
      // Cria a transação
      const transaction = await tx.transaction.create({
        data: {
          amount: price,
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
            decrement: price,
          },
        },
      });

      // Cria a compra
      const newPurchase = await tx.purchase.create({
        data: {
          userId: input.userId,
          cosmeticId: input.cosmeticId,
          transactionId: transaction.id,
          isFromBundle: false,
          status: PurchaseStatus.ACTIVE,
        },
      });

      return newPurchase;
    });

    return {
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
    };
  }
}
