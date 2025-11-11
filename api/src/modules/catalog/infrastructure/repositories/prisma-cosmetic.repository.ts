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
        bundleItems: {
          select: {
            item: {
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
    const cosmetics = await this.prisma.cosmetic.findMany({
      where: {
        type: params.type,
        rarity: params.rarity,
        isNew: params.isNew,
        isAvailable: params.isAvailable,
        isBundle: params.isBundle,
      },
      include: {
        bundleItems: {
          select: {
            item: {
              select: { externalId: true },
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

  async upsert(
    cosmetic: Cosmetic,
    options: UpsertOptions = {},
  ): Promise<Cosmetic> {
    // Campos que sempre são atualizados
    const baseUpdateData = {
      name: cosmetic.name,
      type: cosmetic.type,
      rarity: cosmetic.rarity,
      imageUrl: cosmetic.imageUrl,
      addedAt: cosmetic.addedAt,
      isBundle: cosmetic.isBundle,
    };

    // Adiciona campos condicionalmente
    const updateData = {
      ...baseUpdateData,
      ...(options.updateIsNew !== false && { isNew: cosmetic.isNew }),
      ...(options.updateIsAvailable !== false && {
        isAvailable: cosmetic.isAvailable,
      }),
      ...(options.updatePricing === true && {
        basePrice: cosmetic.basePrice,
        currentPrice: cosmetic.currentPrice,
      }),
    };

    const result = await this.prisma.cosmetic.upsert({
      where: { externalId: cosmetic.externalId },
      create: {
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
        isBundle: cosmetic.isBundle,
      },
      update: updateData,
      include: {
        bundleItems: {
          select: {
            item: {
              select: { externalId: true },
            },
          },
        },
      },
    });

    return this.toEntity(result);
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
        bundleItems: {
          select: {
            item: {
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
      data.bundleItems?.map((bi: any) => bi.item.externalId) ?? [];

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
      data.isBundle,
      childrenExternalIds,
    );
  }
}
