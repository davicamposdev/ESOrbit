"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/shared";
import { Row, Col, Space, Spin } from "antd";
import {
  useDashboard,
  DashboardHeader,
  DashboardStats,
  RecentPurchases,
  QuickActions,
  AccountInfo,
} from "@/features/dashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { purchases, loading: loadingPurchases, stats } = useDashboard();

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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <DashboardHeader username={user.username} />

          <DashboardStats
            credits={user.credits}
            totalPurchases={stats.totalPurchases}
            totalSpent={stats.totalSpent}
            memberSince={new Date(user.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
            loading={loadingPurchases}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <RecentPurchases
                purchases={purchases}
                loading={loadingPurchases}
                onViewAll={() => router.push("/transactions")}
                onExploreCatalog={() => router.push("/catalog")}
              />
            </Col>

            <Col xs={24} lg={12}>
              <QuickActions
                onExploreCatalog={() => router.push("/catalog")}
                onViewInventory={() => router.push("/inventory")}
                onViewBundles={() => router.push("/catalog/bundles")}
                onViewProfile={() => router.push("/profile")}
                onViewTransactions={() => router.push("/transactions")}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <AccountInfo
                id={user.id}
                email={user.email}
                username={user.username}
                createdAt={user.createdAt.toString()}
              />
            </Col>
          </Row>
        </Space>
      </div>
    </AppLayout>
  );
}
