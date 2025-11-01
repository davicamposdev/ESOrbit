import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import type { IUsersRepository } from '../../domain/repositories/users.repository.interface';
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
        displayName: true,
        credits: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
