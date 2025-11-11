import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { Transaction as PrismaTransaction } from '@prisma/client';
import {
  ITransactionRepository,
  CreateTransactionDto,
} from '../../domain/repositories';
import { Transaction } from '../../domain/entities';
import { TransactionType, TransactionStatus } from '../../domain/enums';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        method: data.method,
        type: data.type as any,
        status: (data.status || TransactionStatus.PENDING) as any,
      },
    });

    return this.mapToEntity(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    return transaction ? this.mapToEntity(transaction) : null;
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: { status: status as any },
    });

    return this.mapToEntity(transaction);
  }

  async findMany(filters?: {
    type?: TransactionType;
    status?: TransactionStatus;
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: filters?.type as any,
        status: filters?.status as any,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((t) => this.mapToEntity(t));
  }

  private mapToEntity(data: PrismaTransaction): Transaction {
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      type: data.type as unknown as TransactionType,
      status: data.status as unknown as TransactionStatus,
      createdAt: data.createdAt,
    };
  }
}
