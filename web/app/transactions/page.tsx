"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/shared";
import { Space, Spin, Card, Tabs } from "antd";
import { ShoppingOutlined, SwapOutlined } from "@ant-design/icons";
import {
  useTransactions,
  TransactionsHeader,
  PurchasesTable,
  TransfersTable,
} from "@/features/transactions";

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    purchases,
    transfers,
    loadingPurchases,
    loadingTransfers,
    activeTab,
    setActiveTab,
    handleRefresh,
  } = useTransactions(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <TransactionsHeader
            loading={loadingPurchases || loadingTransfers}
            onRefresh={handleRefresh}
          />

          <Card className="border-2 border-gray-100 rounded-2xl shadow-lg">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: "purchases",
                  label: (
                    <span>
                      <ShoppingOutlined />
                      Compras
                    </span>
                  ),
                  children: (
                    <PurchasesTable
                      purchases={purchases}
                      loading={loadingPurchases}
                      onExploreCatalog={() => router.push("/catalog")}
                    />
                  ),
                },
                {
                  key: "transfers",
                  label: (
                    <span>
                      <SwapOutlined />
                      Transferências
                    </span>
                  ),
                  children: (
                    <TransfersTable
                      transfers={transfers}
                      loading={loadingTransfers}
                      userId={user.id}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Space>
      </div>
    </AppLayout>
  );
}
