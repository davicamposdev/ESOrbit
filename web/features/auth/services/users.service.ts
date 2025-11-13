import { apiClient } from "@/features/auth/services/api-client";

export interface UserCosmetic {
  id: string;
  externalId: string;
  name: string;
  type: string;
  rarity: string;
  imageUrl: string;
  purchasedAt: string;
}

export interface UserWithCosmetics {
  id: string;
  username: string;
  email: string;
  credits: number;
  createdAt: string;
  cosmetics: UserCosmetic[];
}

export interface ListUsersWithCosmeticsResponse {
  users: UserWithCosmetics[];
}

export class UsersService {
  async listAllWithCosmetics(): Promise<ListUsersWithCosmeticsResponse> {
    return apiClient.get<ListUsersWithCosmeticsResponse>("/api/users");
  }
}

export const usersService = new UsersService();
