"use client";

import { useState, useCallback } from "react";
import {
  catalogService,
  type Cosmetic,
  type ListCosmeticsParams,
} from "../services";

interface UseCatalogReturn {
  cosmetics: Cosmetic[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  purchasedCosmeticIds: Set<string>;
  fetchCosmetics: (params?: ListCosmeticsParams) => Promise<void>;
  fetchPurchasedCosmetics: () => Promise<void>;
  syncAll: (language?: string) => Promise<void>;
  syncNew: (language?: string) => Promise<void>;
  syncShop: (language?: string) => Promise<void>;
  clearError: () => void;
}

export function useCatalog(): UseCatalogReturn {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [purchasedCosmeticIds, setPurchasedCosmeticIds] = useState<Set<string>>(
    new Set()
  );

  const fetchCosmetics = useCallback(
    async (params: ListCosmeticsParams = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await catalogService.listCosmetics(params);

        setCosmetics(response.data || []);
        setTotal(response.meta.total || 0);
        setPage(response.meta.page || 1);
        setPageSize(response.meta.pageSize || 20);
        setTotalPages(response.meta.totalPages || 0);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar cosméticos";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const syncAll = useCallback(async (language?: string) => {
    setLoading(true);
    setError(null);

    try {
      await catalogService.syncAll({ language });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao sincronizar cosméticos";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncNew = useCallback(async (language?: string) => {
    setLoading(true);
    setError(null);

    try {
      await catalogService.syncNew({ language });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao sincronizar novos cosméticos";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncShop = useCallback(async (language?: string) => {
    setLoading(true);
    setError(null);

    try {
      await catalogService.syncShop({ language });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao sincronizar loja";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPurchasedCosmetics = useCallback(async () => {
    try {
      const ids = await catalogService.getPurchasedCosmeticIds();
      setPurchasedCosmeticIds(new Set(ids));
    } catch (err) {}
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    cosmetics,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    purchasedCosmeticIds,
    fetchCosmetics,
    fetchPurchasedCosmetics,
    syncAll,
    syncNew,
    syncShop,
    clearError,
  };
}
