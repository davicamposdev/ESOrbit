import { Injectable, Inject } from '@nestjs/common';
import type {
  IUsersRepository,
  UserWithCosmetics,
} from '../../domain/repositories/users.repository.interface';

@Injectable()
export class ListUsersWithCosmeticsUseCase {
  constructor(
    @Inject('IUsersRepository') private readonly repository: IUsersRepository,
  ) {}

  async execute(): Promise<UserWithCosmetics[]> {
    return this.repository.findAllWithCosmetics();
  }
}
