import type { User } from '../entities/user.entity';

export interface UserWithCosmetics {
  id: string;
  username: string;
  email: string;
  credits: number;
  createdAt: Date;
  cosmetics: {
    id: string;
    externalId: string;
    name: string;
    type: string;
    rarity: string;
    imageUrl: string;
    purchasedAt: Date;
  }[];
}

export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findAllWithCosmetics(): Promise<UserWithCosmetics[]>;
}
