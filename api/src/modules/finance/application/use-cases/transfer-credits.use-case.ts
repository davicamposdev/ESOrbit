import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import type {
  ITransactionRepository,
  ITransferRepository,
} from '../../domain/repositories';
import {
  TransactionType,
  TransactionStatus,
  TransferStatus,
} from '../../domain/enums';
import { Transfer } from '../../domain/entities';

export interface TransferCreditsInput {
  fromUserId: string;
  toUserId: string;
  amount: number;
  description?: string;
}

@Injectable()
export class TransferCreditsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ITransferRepository')
    private readonly transferRepository: ITransferRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: TransferCreditsInput): Promise<Transfer> {
    // Validações
    if (input.fromUserId === input.toUserId) {
      throw new BadRequestException('Cannot transfer credits to yourself');
    }

    if (input.amount <= 0) {
      throw new BadRequestException('Transfer amount must be positive');
    }

    // Busca os usuários
    const fromUser = await this.prisma.user.findUnique({
      where: { id: input.fromUserId },
    });

    if (!fromUser) {
      throw new NotFoundException('Sender user not found');
    }

    const toUser = await this.prisma.user.findUnique({
      where: { id: input.toUserId },
    });

    if (!toUser) {
      throw new NotFoundException('Recipient user not found');
    }

    // Verifica saldo
    if (fromUser.credits < input.amount) {
      throw new BadRequestException('Insufficient credits for transfer');
    }

    // Executa a transferência em uma transação atômica
    const transfer = await this.prisma.$transaction(async (tx) => {
      // Cria a transação de débito (remetente)
      const debitTransaction = await tx.transaction.create({
        data: {
          amount: input.amount,
          currency: 'credits',
          method: 'transfer',
          type: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
        },
      });

      // Cria a transação de crédito (destinatário)
      const creditTransaction = await tx.transaction.create({
        data: {
          amount: input.amount,
          currency: 'credits',
          method: 'transfer',
          type: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
        },
      });

      // Debita do remetente
      await tx.user.update({
        where: { id: input.fromUserId },
        data: {
          credits: {
            decrement: input.amount,
          },
        },
      });

      // Credita ao destinatário
      await tx.user.update({
        where: { id: input.toUserId },
        data: {
          credits: {
            increment: input.amount,
          },
        },
      });

      // Cria o registro de transferência
      const newTransfer = await tx.transfer.create({
        data: {
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
          fromTransactionId: debitTransaction.id,
          toTransactionId: creditTransaction.id,
          description: input.description || null,
          status: TransferStatus.COMPLETED,
        },
      });

      return newTransfer;
    });

    return {
      id: transfer.id,
      fromUserId: transfer.fromUserId,
      toUserId: transfer.toUserId,
      fromTransactionId: transfer.fromTransactionId,
      toTransactionId: transfer.toTransactionId,
      status: transfer.status as unknown as TransferStatus,
      description: transfer.description,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    };
  }
}
