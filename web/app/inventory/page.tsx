"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout, ItemFilters } from "@/shared";
import { Space, Spin } from "antd";
import {
  useInventory,
  InventoryHeader,
  InventoryStats,
  InventoryGrid,
  ItemDetailModal,
} from "@/features/inventory";

export default function InventoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    purchases,
    allPurchases,
    loading: loadingInventory,
    selectedPurchase,
    isModalVisible,
    isReturning,
    stats,
    handleFilter,
    handleViewDetails,
    handleCloseModal,
    handleReturnCosmetic,
  } = useInventory();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <InventoryHeader onBack={() => router.push("/dashboard")} />

          <InventoryStats
            totalItems={stats.totalItems}
            uniqueTypes={stats.uniqueTypes}
            totalValue={stats.totalValue}
          />

          <ItemFilters
            config={{
              searchPlaceholder: "Buscar por nome do item...",
              types: [
                { value: undefined, label: "Todos os tipos" },
                { value: "skin", label: "Skins" },
                { value: "emote", label: "Emotes" },
                { value: "pickaxe", label: "Picaretas" },
                { value: "glider", label: "Planadores" },
                { value: "backpack", label: "Mochilas" },
                { value: "wrap", label: "Embalagens" },
              ],
              showDateRange: false,
              showPageSize: false,
              toggleFilters: [],
            }}
            onFilter={handleFilter}
            loading={loadingInventory}
          />

          <InventoryGrid
            purchases={purchases}
            allPurchases={allPurchases}
            loading={loadingInventory}
            onItemClick={handleViewDetails}
            onExploreCatalog={() => router.push("/catalog")}
          />
        </Space>
      </div>

      <ItemDetailModal
        purchase={selectedPurchase}
        visible={isModalVisible}
        returning={isReturning}
        onClose={handleCloseModal}
        onReturn={handleReturnCosmetic}
      />
    </AppLayout>
  );
}
