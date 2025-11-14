"use client";

import { useState, useCallback } from "react";
import {
  catalogService,
  type Bundle,
  type ListBundlesParams,
} from "../services";

interface UseBundlesReturn {
  bundles: Bundle[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  purchasedBundleIds: Set<string>;
  fetchBundles: (params?: ListBundlesParams) => Promise<void>;
  fetchPurchasedBundles: () => Promise<void>;
  clearError: () => void;
}

export function useBundles(): UseBundlesReturn {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [purchasedBundleIds, setPurchasedBundleIds] = useState<Set<string>>(
    new Set()
  );

  const fetchBundles = useCallback(async (params?: ListBundlesParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await catalogService.listBundles(params);
      setBundles(response.data);
      setTotal(response.meta.total);
      setPage(response.meta.page);
      setPageSize(response.meta.pageSize);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao buscar bundles";
      setError(errorMessage);
      setBundles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPurchasedBundles = useCallback(async () => {
    try {
      const ids = await catalogService.getPurchasedBundleIds();
      setPurchasedBundleIds(new Set(ids));
    } catch (err) {}
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    bundles,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    purchasedBundleIds,
    fetchBundles,
    fetchPurchasedBundles,
    clearError,
  };
}
