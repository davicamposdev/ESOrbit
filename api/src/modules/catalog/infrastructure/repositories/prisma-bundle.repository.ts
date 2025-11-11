import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { IBundleRepository } from '../../domain/repositories/bundle.repository.interface';
import { Bundle } from '../../domain/entities/bundle.entity';

@Injectable()
export class PrismaBundleRepository implements IBundleRepository {
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

  async findById(id: string): Promise<Bundle | null> {
    const bundle = await this.prisma.bundle.findUnique({
      where: { id },
    });

    if (!bundle) return null;

    return Bundle.restore(bundle.id, bundle.externalId, bundle.name);
  }

  async findByExternalId(externalId: string): Promise<Bundle | null> {
    const bundle = await this.prisma.bundle.findUnique({
      where: { externalId },
    });

    if (!bundle) return null;

    return Bundle.restore(bundle.id, bundle.externalId, bundle.name);
  }

  async findAll(): Promise<Bundle[]> {
    const bundles = await this.prisma.bundle.findMany();
    return bundles.map((bundle) =>
      Bundle.restore(bundle.id, bundle.externalId, bundle.name),
    );
  }

  async update(id: string, name: string): Promise<Bundle> {
    const updated = await this.prisma.bundle.update({
      where: { id },
      data: { name },
    });

    return Bundle.restore(updated.id, updated.externalId, updated.name);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.bundle.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }

  async createBundleRelation(
    bundleId: string,
    itemId: string,
    description: string,
  ): Promise<void> {
    await this.prisma.bundleItem.upsert({
      where: {
        bundleId_itemId: {
          bundleId,
          itemId,
        },
      },
      update: {
        description,
      },
      create: {
        bundleId,
        itemId,
        description,
      },
    });
  }
}
