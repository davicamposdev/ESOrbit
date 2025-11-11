import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { IReturnRepository, CreateReturnDto } from '../../domain/repositories';
import { Return } from '../../domain/entities';
import { ReturnStatus } from '../../domain/enums';

@Injectable()
export class PrismaReturnRepository implements IReturnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReturnDto): Promise<Return> {
    const returnRecord = await this.prisma.return.create({
      data: {
        purchaseId: data.purchaseId,
        userId: data.userId,
        cosmeticId: data.cosmeticId,
        transactionId: data.transactionId,
        reason: data.reason || null,
        isPartial: data.isPartial || false,
        status: ReturnStatus.PENDING as any,
      },
    });

    return this.mapToEntity(returnRecord);
  }

  async createInTransaction(data: CreateReturnDto, tx: any): Promise<Return> {
    const returnRecord = await tx.return.create({
      data: {
        purchaseId: data.purchaseId,
        userId: data.userId,
        cosmeticId: data.cosmeticId,
        transactionId: data.transactionId,
        reason: data.reason || null,
        isPartial: data.isPartial || false,
        status: ReturnStatus.PENDING,
      },
    });

    return this.mapToEntity(returnRecord);
  }

  async findById(id: string): Promise<Return | null> {
    const returnRecord = await this.prisma.return.findUnique({
      where: { id },
    });

    return returnRecord ? this.mapToEntity(returnRecord) : null;
  }

  async findByPurchaseId(purchaseId: string): Promise<Return[]> {
    const returns = await this.prisma.return.findMany({
      where: { purchaseId },
      orderBy: { createdAt: 'desc' },
    });

    return returns.map((r) => this.mapToEntity(r));
  }

  async updateStatus(id: string, status: ReturnStatus): Promise<Return> {
    const returnRecord = await this.prisma.return.update({
      where: { id },
      data: { status: status as any },
    });

    return this.mapToEntity(returnRecord);
  }

  async findByUserId(
    userId: string,
    filters?: {
      status?: ReturnStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Return[]> {
    const returns = await this.prisma.return.findMany({
      where: {
        userId,
        status: filters?.status as any,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });

    return returns.map((r) => this.mapToEntity(r));
  }

  private mapToEntity(data: any): Return {
    return {
      id: data.id,
      purchaseId: data.purchaseId,
      userId: data.userId,
      cosmeticId: data.cosmeticId,
      transactionId: data.transactionId,
      reason: data.reason,
      isPartial: data.isPartial,
      status: data.status as ReturnStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
