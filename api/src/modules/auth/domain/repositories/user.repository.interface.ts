import type { AuthenticatedUser } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<AuthenticatedUser | null>;
  findById(id: string): Promise<AuthenticatedUser | null>;
  create(data: CreateUserData): Promise<AuthenticatedUser>;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  displayName: string;
}
