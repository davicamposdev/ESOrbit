import type { User } from '../entities/user.entity';

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
}
