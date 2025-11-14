"use client";

import { useState, useEffect } from "react";
import {
  usersService,
  type UserWithCosmetics,
} from "@/features/auth/services/users.service";

export function useUsersInventory() {
  const [users, setUsers] = useState<UserWithCosmetics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.listAllWithCosmetics();
      setUsers(response.users);
    } catch (err) {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    loadUsers,
  };
}
