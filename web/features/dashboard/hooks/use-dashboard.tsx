"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { financeService, type PurchaseResponse } from "@/shared";

export function useDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadRecentPurchases();
    }
  }, [user, authLoading]);

  const loadRecentPurchases = async () => {
    setLoading(true);
    try {
      const data = await financeService.listPurchases({ limit: 3 });
      setPurchases(data);
    } catch (error) {
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalSpent = purchases.reduce(
      (sum, purchase) => sum + (purchase.transaction?.amount || 0),
      0
    );
    const totalPurchases = purchases.length;
    return { totalSpent, totalPurchases };
  };

  return {
    purchases,
    loading,
    stats: calculateStats(),
    loadRecentPurchases,
  };
}
