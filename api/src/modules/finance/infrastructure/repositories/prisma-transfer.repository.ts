import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  ITransferRepository,
  CreateTransferDto,
} from '../../domain/repositories';
import { Transfer } from '../../domain/entities';
import { TransferStatus } from '../../domain/enums';

@Injectable()
export class PrismaTransferRepository implements ITransferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTransferDto): Promise<Transfer> {
    const transfer = await this.prisma.transfer.create({
      data: {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        fromTransactionId: data.fromTransactionId,
        toTransactionId: data.toTransactionId,
        description: data.description || null,
        status: TransferStatus.PENDING as any,
      },
    });

    return this.mapToEntity(transfer);
  }

  async createInTransaction(
    data: CreateTransferDto,
    tx: any,
  ): Promise<Transfer> {
    const transfer = await tx.transfer.create({
      data: {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        fromTransactionId: data.fromTransactionId,
        toTransactionId: data.toTransactionId,
        description: data.description || null,
        status: TransferStatus.PENDING,
      },
    });

    return this.mapToEntity(transfer);
  }

  async findById(id: string): Promise<Transfer | null> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
    });

    return transfer ? this.mapToEntity(transfer) : null;
  }

  async updateStatus(id: string, status: TransferStatus): Promise<Transfer> {
    const transfer = await this.prisma.transfer.update({
      where: { id },
      data: { status: status as any },
    });

    return this.mapToEntity(transfer);
  }

  async findByUserId(
    userId: string,
    filters?: {
      direction?: 'sent' | 'received' | 'all';
      status?: TransferStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Transfer[]> {
    const where: any = {};

    if (filters?.direction === 'sent') {
      where.fromUserId = userId;
    } else if (filters?.direction === 'received') {
      where.toUserId = userId;
    } else {
      where.OR = [{ fromUserId: userId }, { toUserId: userId }];
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    const transfers = await this.prisma.transfer.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });

    return transfers.map((t) => this.mapToEntity(t));
  }

  private mapToEntity(data: any): Transfer {
    return {
      id: data.id,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      fromTransactionId: data.fromTransactionId,
      toTransactionId: data.toTransactionId,
      status: data.status as TransferStatus,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
