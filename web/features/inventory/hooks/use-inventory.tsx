"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { financeService, type PurchaseResponse } from "@/shared";
import { App } from "antd";

export function useInventory() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const { message, modal } = App.useApp();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<
    PurchaseResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseResponse | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadInventory();
    }
  }, [user, authLoading]);

  useEffect(() => {
    setFilteredPurchases(purchases);
  }, [purchases]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await financeService.listPurchases({ status: "ACTIVE" });
      setPurchases(data);
    } catch (error) {
      message.error("Erro ao carregar seu inventário");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: {
    name?: string;
    type?: string;
    rarity?: string;
    page?: number;
    pageSize?: number;
  }) => {
    let filtered = [...purchases];

    if (filters.name) {
      filtered = filtered.filter((purchase) =>
        purchase.cosmetic?.name
          ?.toLowerCase()
          .includes(filters.name!.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.cosmetic?.type?.toLowerCase() === filters.type?.toLowerCase()
      );
    }

    if (filters.rarity) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.cosmetic?.rarity?.toLowerCase() ===
          filters.rarity?.toLowerCase()
      );
    }

    setFilteredPurchases(filtered);
  };

  const handleViewDetails = (purchase: PurchaseResponse) => {
    setSelectedPurchase(purchase);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPurchase(null);
  };

  const handleReturnCosmetic = async () => {
    if (!selectedPurchase) return;

    modal.confirm({
      title: "Confirmar Devolução",
      content: (
        <div>
          <p>
            Tem certeza que deseja devolver{" "}
            <strong>{selectedPurchase.cosmetic?.name}</strong>?
          </p>
          <p>
            Você receberá{" "}
            <strong>{selectedPurchase.transaction?.amount || 0} V-Bucks</strong>{" "}
            de volta.
          </p>
          <p style={{ color: "#ff4d4f" }}>Esta ação não pode ser desfeita.</p>
        </div>
      ),
      okText: "Sim, devolver",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        setIsReturning(true);
        try {
          await financeService.returnCosmetic(selectedPurchase.id);
          message.success(
            `${selectedPurchase.cosmetic?.name} devolvido com sucesso!`
          );
          handleCloseModal();
          await Promise.all([loadInventory(), updateUser()]);
        } catch (error: any) {
          message.error(
            error.response?.data?.message ||
              "Erro ao devolver o cosmético. Tente novamente."
          );
        } finally {
          setIsReturning(false);
        }
      },
    });
  };

  const calculateStats = () => {
    const uniqueTypes = new Set(
      purchases.map((p) => p.cosmetic?.type).filter(Boolean)
    );
    const totalValue = purchases.reduce(
      (sum, p) => sum + (p.transaction?.amount || 0),
      0
    );
    return {
      totalItems: purchases.length,
      uniqueTypes: uniqueTypes.size,
      totalValue,
    };
  };

  return {
    purchases: filteredPurchases,
    allPurchases: purchases,
    loading,
    selectedPurchase,
    isModalVisible,
    isReturning,
    stats: calculateStats(),
    handleFilter,
    handleViewDetails,
    handleCloseModal,
    handleReturnCosmetic,
  };
}
