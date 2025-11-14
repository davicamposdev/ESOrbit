"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Row, Col, Spin, Empty, Button, App, Space } from "antd";
import {
  ReloadOutlined,
  GiftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/features/auth";
import {
  useBundles,
  BundleCard,
  Pagination,
  BundlePurchaseModal,
  type Bundle,
  type ListBundlesParams,
} from "@/features/catalog";
import { AppLayout, ItemFilters, type ItemFiltersConfig } from "@/shared";

const { Title, Text } = Typography;

export default function BundlesPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const { user, loading: authLoading, updateUser } = useAuth();
  const {
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
  } = useBundles();

  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [filters, setFilters] = useState<ListBundlesParams>({
    page: 1,
    pageSize: 20,
    isAvailable: true,
  });

  useEffect(() => {
    fetchBundles(filters);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPurchasedBundles();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError, message]);

  const handleFilter = (newFilters: ListBundlesParams) => {
    setFilters(newFilters);
    fetchBundles(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchBundles(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchBundles(filters);
    message.success("Lista de bundles atualizada!");
  };

  const handleSelectBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setPurchaseModalOpen(true);
  };

  const handleClosePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedBundle(null);
  };

  const handlePurchaseSuccess = async () => {
    await updateUser();
    await fetchPurchasedBundles();
    fetchBundles(filters);
  };

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

  return (
    <AppLayout>
      <div
        style={{
          padding: "24px",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div className="bg-linear-to-br from-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl mb-6">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Title level={2} style={{ margin: 0, color: "white" }}>
                  <GiftOutlined style={{ marginRight: 8 }} />
                  Bundles
                </Title>
                <Text
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}
                >
                  Economize comprando pacotes especiais com múltiplos itens
                </Text>
              </Space>
            </div>
          </div>
          <div>
            <Space wrap>
              <Button
                icon={<ShoppingOutlined />}
                onClick={() => router.push("/catalog")}
                size="large"
                className="h-12 font-semibold"
              >
                Ver Catálogo
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
                size="large"
                className="h-12 font-semibold"
              >
                Atualizar
              </Button>
            </Space>
          </div>
        </div>
        <ItemFilters<ListBundlesParams>
          config={{
            searchPlaceholder: "Digite o nome do bundle",
            showType: false,
            showRarity: false,
            showDateRange: false,
            toggleFilters: [
              {
                key: "isAvailable",
                label: "Apenas disponíveis",
                checked: true,
              },
              { key: "onSale", label: "Em promoção" },
            ],
            initialFilters: {
              isAvailable: true,
            },
          }}
          onFilter={handleFilter}
          loading={loading}
        />

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "100px 0",
              minHeight: "400px",
            }}
          >
            <Spin size="large" />
            <Text style={{ marginTop: 16 }} type="secondary">
              {bundles && bundles.length > 0
                ? "Aplicando filtros..."
                : "Carregando bundles..."}
            </Text>
          </div>
        ) : !bundles || bundles.length === 0 ? (
          <Empty
            description={
              <Space direction="vertical" size="large">
                <Text>Nenhum bundle encontrado</Text>
                <Text type="secondary">
                  Tente ajustar os filtros ou recarregar a página
                </Text>
              </Space>
            }
            style={{ padding: "100px 0" }}
          >
            <Button onClick={handleRefresh}>Recarregar</Button>
          </Empty>
        ) : (
          <>
            <div style={{ marginBottom: 16, textAlign: "right" }}>
              <Text type="secondary">
                Mostrando {bundles.length} de {total} bundles
              </Text>
            </div>

            <Spin spinning={loading}>
              <Row gutter={[16, 16]}>
                {bundles.map((bundle) => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={6} key={bundle.id}>
                    <BundleCard
                      bundle={bundle}
                      onSelect={handleSelectBundle}
                      isPurchased={purchasedBundleIds.has(bundle.id)}
                    />
                  </Col>
                ))}
              </Row>
            </Spin>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </div>

      <BundlePurchaseModal
        bundle={selectedBundle}
        open={purchaseModalOpen}
        userCredits={user?.credits || 0}
        onClose={handleClosePurchaseModal}
        onSuccess={handlePurchaseSuccess}
        isPurchased={
          selectedBundle ? purchasedBundleIds.has(selectedBundle.id) : false
        }
      />
    </AppLayout>
  );
}
