import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import type {
  IUsersRepository,
  UserWithCosmetics,
} from '../../domain/repositories/users.repository.interface';
import type { User } from '../../domain/entities/user.entity';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        credits: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAllWithCosmetics(): Promise<UserWithCosmetics[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        credits: true,
        createdAt: true,
        purchases: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            cosmetic: {
              select: {
                id: true,
                externalId: true,
                name: true,
                type: true,
                rarity: true,
                imageUrl: true,
              },
            },
            createdAt: true,
          },
        },
      },
      orderBy: {
        username: 'asc',
      },
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      credits: user.credits,
      createdAt: user.createdAt,
      cosmetics: user.purchases.map((purchase) => ({
        id: purchase.cosmetic.id,
        externalId: purchase.cosmetic.externalId,
        name: purchase.cosmetic.name,
        type: purchase.cosmetic.type,
        rarity: purchase.cosmetic.rarity,
        imageUrl: purchase.cosmetic.imageUrl,
        purchasedAt: purchase.createdAt,
      })),
    }));
  }
}
