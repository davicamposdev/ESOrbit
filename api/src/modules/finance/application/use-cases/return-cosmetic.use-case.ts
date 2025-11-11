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
  IReturnRepository,
} from '../../domain/repositories';
import {
  TransactionType,
  TransactionStatus,
  PurchaseStatus,
  ReturnStatus,
} from '../../domain/enums';
import { Return } from '../../domain/entities';

export interface ReturnCosmeticInput {
  userId: string;
  purchaseId: string;
  reason?: string;
}

@Injectable()
export class ReturnCosmeticUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IPurchaseRepository')
    private readonly purchaseRepository: IPurchaseRepository,
    @Inject('IReturnRepository')
    private readonly returnRepository: IReturnRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: ReturnCosmeticInput): Promise<Return> {
    // Busca a compra
    const purchase = await this.purchaseRepository.findById(input.purchaseId);

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    // Valida se a compra pertence ao usuário
    if (purchase.userId !== input.userId) {
      throw new BadRequestException('Purchase does not belong to this user');
    }

    // Valida se a compra pode ser devolvida
    if (purchase.status !== PurchaseStatus.ACTIVE) {
      throw new BadRequestException('Only active purchases can be returned');
    }

    // Busca a transação original para obter o valor
    const originalTransaction = await this.transactionRepository.findById(
      purchase.transactionId,
    );

    if (!originalTransaction) {
      throw new NotFoundException('Original transaction not found');
    }

    // Executa a devolução em uma transação atômica
    const returnRecord = await this.prisma.$transaction(async (tx) => {
      // Cria a transação de reembolso
      const refundTransaction = await tx.transaction.create({
        data: {
          amount: originalTransaction.amount,
          currency: 'credits',
          method: 'refund',
          type: TransactionType.REFUND,
          status: TransactionStatus.COMPLETED,
        },
      });

      // Credita os créditos de volta ao usuário
      await tx.user.update({
        where: { id: input.userId },
        data: {
          credits: {
            increment: originalTransaction.amount,
          },
        },
      });

      // Marca a compra como devolvida
      await tx.purchase.update({
        where: { id: input.purchaseId },
        data: {
          status: PurchaseStatus.RETURNED,
          returnedAt: new Date(),
        },
      });

      // Cria o registro de devolução
      const newReturn = await tx.return.create({
        data: {
          purchaseId: input.purchaseId,
          userId: input.userId,
          cosmeticId: purchase.cosmeticId,
          transactionId: refundTransaction.id,
          reason: input.reason || null,
          isPartial: false,
          status: ReturnStatus.COMPLETED,
        },
      });

      return newReturn;
    });

    return {
      id: returnRecord.id,
      purchaseId: returnRecord.purchaseId,
      userId: returnRecord.userId,
      cosmeticId: returnRecord.cosmeticId,
      transactionId: returnRecord.transactionId,
      reason: returnRecord.reason,
      isPartial: returnRecord.isPartial,
      status: returnRecord.status as unknown as ReturnStatus,
      createdAt: returnRecord.createdAt,
      updatedAt: returnRecord.updatedAt,
    };
  }
}
