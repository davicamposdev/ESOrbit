"use client";

import { useState, useEffect } from "react";
import { App } from "antd";
import {
  financeService,
  type PurchaseResponse,
  type TransferResponse,
} from "@/features/finance";

export function useTransactions(userId?: string) {
  const { message } = App.useApp();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [transfers, setTransfers] = useState<TransferResponse[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [activeTab, setActiveTab] = useState("purchases");

  useEffect(() => {
    if (userId) {
      loadPurchases();
      loadTransfers();
    }
  }, [userId]);

  const loadPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const data = await financeService.listPurchases({ limit: 100 });
      setPurchases(data);
    } catch (error) {
      message.error("Erro ao carregar compras");
      console.error(error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const loadTransfers = async () => {
    setLoadingTransfers(true);
    try {
      const data = await financeService.listTransfers({ limit: 100 });
      setTransfers(data);
    } catch (error) {
      message.error("Erro ao carregar transferências");
      console.error(error);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "purchases") {
      loadPurchases();
    } else {
      loadTransfers();
    }
    message.success("Dados atualizados!");
  };

  return {
    purchases,
    transfers,
    loadingPurchases,
    loadingTransfers,
    activeTab,
    setActiveTab,
    handleRefresh,
  };
}
