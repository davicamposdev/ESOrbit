import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUsersRepository } from '../../domain/repositories/users.repository.interface';
import type { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('IUsersRepository') private readonly repository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.repository.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}
