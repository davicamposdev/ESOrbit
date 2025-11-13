import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  IPurchaseRepository,
  CreatePurchaseDto,
} from '../../domain/repositories';
import { Purchase } from '../../domain/entities';
import { PurchaseStatus } from '../../domain/enums';

@Injectable()
export class PrismaPurchaseRepository implements IPurchaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePurchaseDto): Promise<Purchase> {
    const purchase = await this.prisma.purchase.create({
      data: {
        userId: data.userId,
        cosmeticId: data.cosmeticId,
        transactionId: data.transactionId,
        isFromBundle: data.isFromBundle || false,
        parentPurchaseId: data.parentPurchaseId || null,
        status: PurchaseStatus.ACTIVE as any,
      },
    });

    return this.mapToEntity(purchase);
  }

  async createInTransaction(
    data: CreatePurchaseDto,
    tx: any,
  ): Promise<Purchase> {
    const purchase = await tx.purchase.create({
      data: {
        userId: data.userId,
        cosmeticId: data.cosmeticId,
        transactionId: data.transactionId,
        isFromBundle: data.isFromBundle || false,
        parentPurchaseId: data.parentPurchaseId || null,
        status: PurchaseStatus.ACTIVE,
      },
    });

    return this.mapToEntity(purchase);
  }

  async findById(id: string): Promise<Purchase | null> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        cosmetic: true,
        transaction: true,
      },
    });

    return purchase ? this.mapToEntity(purchase) : null;
  }

  async findByUserAndCosmetic(
    userId: string,
    cosmeticId: string,
  ): Promise<Purchase | null> {
    const purchase = await this.prisma.purchase.findUnique({
      where: {
        userId_cosmeticId: {
          userId,
          cosmeticId,
        },
      },
    });

    return purchase ? this.mapToEntity(purchase) : null;
  }

  async updateStatus(id: string, status: PurchaseStatus): Promise<Purchase> {
    const purchase = await this.prisma.purchase.update({
      where: { id },
      data: { status: status as any },
    });

    return this.mapToEntity(purchase);
  }

  async markAsReturned(id: string): Promise<Purchase> {
    const purchase = await this.prisma.purchase.update({
      where: { id },
      data: {
        status: PurchaseStatus.RETURNED as any,
        returnedAt: new Date(),
      },
    });

    return this.mapToEntity(purchase);
  }

  async findByUserId(
    userId: string,
    filters?: {
      status?: PurchaseStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<Purchase[]> {
    const purchases = await this.prisma.purchase.findMany({
      where: {
        userId,
        status: filters?.status as any,
      },
      include: {
        cosmetic: true,
        transaction: true,
      },
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: 'desc' },
    });

    return purchases.map((p) => this.mapToEntity(p));
  }

  async findBundleChildren(parentPurchaseId: string): Promise<Purchase[]> {
    const purchases = await this.prisma.purchase.findMany({
      where: {
        parentPurchaseId,
      },
    });

    return purchases.map((p) => this.mapToEntity(p));
  }

  private mapToEntity(data: any): Purchase {
    return {
      id: data.id,
      userId: data.userId,
      cosmeticId: data.cosmeticId,
      transactionId: data.transactionId,
      isFromBundle: data.isFromBundle,
      parentPurchaseId: data.parentPurchaseId,
      status: data.status as PurchaseStatus,
      returnedAt: data.returnedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      cosmetic: data.cosmetic
        ? {
            id: data.cosmetic.id,
            name: data.cosmetic.name,
            description: data.cosmetic.description,
            type: data.cosmetic.type,
            rarity: data.cosmetic.rarity,
            imageUrl: data.cosmetic.imageUrl,
            regularPrice: data.cosmetic.regularPrice,
            finalPrice: data.cosmetic.finalPrice,
            onSale: data.cosmetic.onSale,
            isAvailable: data.cosmetic.isAvailable,
          }
        : undefined,
      transaction: data.transaction
        ? {
            id: data.transaction.id,
            userId: data.transaction.userId,
            amount: data.transaction.amount,
            type: data.transaction.type,
            status: data.transaction.status,
            createdAt: data.transaction.createdAt,
          }
        : undefined,
    };
  }
}
