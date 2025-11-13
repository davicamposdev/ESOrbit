import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import type {
  IUserRepository,
  CreateUserData,
} from '../../domain/repositories/user.repository.interface';
import { AuthenticatedUser } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    return AuthenticatedUser.create(
      user.id,
      user.email,
      user.username,
      user.credits,
      user.createdAt,
    );
  }

  async findById(id: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    return AuthenticatedUser.create(
      user.id,
      user.email,
      user.username,
      user.credits,
      user.createdAt,
    );
  }

  async create(data: CreateUserData): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.create({
      data: { ...data, credits: 10000 },
      select: {
        id: true,
        email: true,
        username: true,
        credits: true,
        createdAt: true,
      },
    });

    return AuthenticatedUser.create(
      user.id,
      user.email,
      user.username,
      user.credits,
      user.createdAt,
    );
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
