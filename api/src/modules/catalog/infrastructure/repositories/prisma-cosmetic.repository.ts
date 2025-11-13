import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import type {
  ICosmeticRepository,
  FindManyParams,
  UpsertOptions,
} from '../../domain/repositories/cosmetic.repository.interface';
import { Cosmetic } from '../../domain/entities/cosmetic.entity';

@Injectable()
export class PrismaCosmeticRepository implements ICosmeticRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByExternalId(externalId: string): Promise<Cosmetic | null> {
    const cosmetic = await this.prisma.cosmetic.findUnique({
      where: { externalId: externalId },
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    if (!cosmetic) return null;

    return this.toEntity(cosmetic);
  }

  async findMany(params: FindManyParams = {}): Promise<Cosmetic[]> {
    const where: any = {
      type: params.type,
      rarity: params.rarity,
      isNew: params.isNew,
      isAvailable: params.isAvailable,
      isBundle: params.isBundle,
      onSale: params.onSale,
    };

    if (params.createdFrom || params.createdTo) {
      where.addedAt = {};
      if (params.createdFrom) {
        where.addedAt.gte =
          params.createdFrom instanceof Date
            ? params.createdFrom
            : new Date(params.createdFrom);
      }
      if (params.createdTo) {
        where.addedAt.lte =
          params.createdTo instanceof Date
            ? params.createdTo
            : new Date(params.createdTo);
      }
    }

    const cosmetics = await this.prisma.cosmetic.findMany({
      where,
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { id: true },
            },
          },
        },
      },
      take: params.limit,
      skip: params.offset,
      orderBy: { createdAt: 'desc' },
    });

    return cosmetics.map((c) => this.toEntity(c));
  }

  async create(cosmetic: Cosmetic): Promise<Cosmetic> {
    const created = await this.prisma.cosmetic.create({
      data: {
        externalId: cosmetic.externalId,
        name: cosmetic.name,
        type: cosmetic.type,
        rarity: cosmetic.rarity,
        imageUrl: cosmetic.imageUrl,
        addedAt: cosmetic.addedAt,
        isNew: cosmetic.isNew,
        isAvailable: cosmetic.isAvailable,
        basePrice: cosmetic.basePrice,
        currentPrice: cosmetic.currentPrice,
        onSale: cosmetic.onSale,
        isBundle: cosmetic.isBundle,
      },
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    return this.toEntity(created);
  }

  async update(
    cosmetic: Cosmetic,
    options: UpsertOptions = {},
  ): Promise<Cosmetic> {
    const baseUpdateData = {
      name: cosmetic.name,
      type: cosmetic.type,
      rarity: cosmetic.rarity,
      imageUrl: cosmetic.imageUrl,
      addedAt: cosmetic.addedAt,
      isBundle: cosmetic.isBundle,
    };

    const updateData = {
      ...baseUpdateData,
      ...(options.updateIsNew !== false && { isNew: cosmetic.isNew }),
      ...(options.updateIsAvailable !== false && {
        isAvailable: cosmetic.isAvailable,
      }),
      ...(options.updatePricing === true && {
        basePrice: cosmetic.basePrice,
        currentPrice: cosmetic.currentPrice,
        onSale: cosmetic.onSale,
      }),
    };

    const updated = await this.prisma.cosmetic.update({
      where: { externalId: cosmetic.externalId },
      data: updateData,
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    return this.toEntity(updated);
  }

  async findById(id: string): Promise<Cosmetic | null> {
    const cosmetic = await this.prisma.cosmetic.findUnique({
      where: { id },
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    if (!cosmetic) return null;

    return this.toEntity(cosmetic);
  }

  async findManyByIds(ids: string[]): Promise<Map<string, Cosmetic>> {
    const cosmetics = await this.prisma.cosmetic.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    const cosmeticMap = new Map<string, Cosmetic>();
    cosmetics.forEach((c) => {
      cosmeticMap.set(c.id, this.toEntity(c));
    });

    return cosmeticMap;
  }

  async findManyByExternalIds(
    externalIds: string[],
  ): Promise<Map<string, Cosmetic>> {
    const cosmetics = await this.prisma.cosmetic.findMany({
      where: {
        externalId: {
          in: externalIds,
        },
      },
      include: {
        bundleCosmetics: {
          select: {
            cosmetic: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    const cosmeticMap = new Map<string, Cosmetic>();
    cosmetics.forEach((c) => {
      cosmeticMap.set(c.externalId, this.toEntity(c));
    });

    return cosmeticMap;
  }

  private toEntity(data: any): Cosmetic {
    const childrenExternalIds =
      data.bundleCosmetics?.map((bi: any) => bi.cosmetic.externalId) ?? [];

    return Cosmetic.restore(
      data.id,
      data.externalId,
      data.name,
      data.type,
      data.rarity,
      data.imageUrl,
      data.addedAt,
      data.isNew,
      data.isAvailable,
      data.basePrice,
      data.currentPrice,
      data.onSale ?? false,
      data.isBundle,
      childrenExternalIds,
    );
  }
}
