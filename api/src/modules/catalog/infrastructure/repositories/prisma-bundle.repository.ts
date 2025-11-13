import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { IBundleRepository } from '../../domain/repositories/bundle.repository.interface';
import { Bundle } from '../../domain/entities/bundle.entity';

@Injectable()
export class PrismaBundleRepository implements IBundleRepository {
  private readonly logger = new Logger(PrismaBundleRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Bundle): Promise<Bundle> {
    const bundle = await this.prisma.bundle.create({
      data: {
        externalId: data.externalId,
        name: data.name,
      },
    });

    return Bundle.restore(bundle.id, bundle.externalId, bundle.name);
  }

  async findByExternalId(externalId: string): Promise<Bundle | null> {
    const bundle = await this.prisma.bundle.findUnique({
      where: { externalId },
    });

    if (!bundle) return null;

    return Bundle.restore(bundle.id, bundle.externalId, bundle.name);
  }

  async findAll(): Promise<Array<{ bundle: Bundle; cosmeticIds: string[] }>> {
    const bundles = await this.prisma.bundle.findMany({
      include: {
        relation: {
          include: {
            cosmetic: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const result = bundles.map((bundle) => ({
      bundle: Bundle.restore(bundle.id, bundle.externalId, bundle.name),
      cosmeticIds: bundle.relation.map((bc) => bc.cosmetic.id),
    }));

    return result;
  }

  async update(id: string, name: string): Promise<Bundle> {
    const updated = await this.prisma.bundle.update({
      where: { id },
      data: { name },
    });

    return Bundle.restore(updated.id, updated.externalId, updated.name);
  }

  async createBundleRelation(
    bundleId: string,
    cosmeticId: string,
    description: string,
  ): Promise<void> {
    await this.prisma.bundleCosmetic.upsert({
      where: {
        bundleId_cosmeticId: {
          bundleId,
          cosmeticId,
        },
      },
      update: {
        description,
      },
      create: {
        bundleId,
        cosmeticId,
        description,
      },
    });
  }
}
