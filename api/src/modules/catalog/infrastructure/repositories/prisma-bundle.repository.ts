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

  async update(id: string, data: Partial<Bundle>): Promise<Bundle | null> {
    const bundle = await this.prisma.bundle.updateMany({
      where: { id },
      data: {
        externalId: data.externalId,
        name: data.name,
      },
    });

    if (bundle.count === 0) return null;

    const updatedBundle = await this.prisma.bundle.findUnique({
      where: { id },
    });

    if (!updatedBundle) return null;

    return Bundle.restore(
      updatedBundle.id,
      updatedBundle.externalId,
      updatedBundle.name,
    );
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
