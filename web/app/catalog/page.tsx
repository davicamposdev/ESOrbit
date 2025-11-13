"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Row, Col, Spin, Empty, Button, App, Space } from "antd";
import {
  ShoppingCartOutlined,
  ReloadOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/features/auth";
import {
  useCatalog,
  CatalogFilters,
  CosmeticCard,
  Pagination,
  PurchaseModal,
  type Cosmetic,
  type ListCosmeticsParams,
} from "@/features/catalog";
import { AppLayout } from "@/shared";

const { Title, Text } = Typography;

export default function CatalogPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const { user, loading: authLoading, updateUser } = useAuth();
  const {
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
    syncShop,
    clearError,
  } = useCatalog();

  const [selectedCosmetic, setSelectedCosmetic] = useState<Cosmetic | null>(
    null
  );
  const [filters, setFilters] = useState<ListCosmeticsParams>({
    page: 1,
    pageSize: 20,
  });
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  useEffect(() => {
    fetchCosmetics(filters);
    if (!authLoading && user) {
      fetchPurchasedCosmetics();
    }
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError, message]);

  const handleFilter = (newFilters: ListCosmeticsParams) => {
    setFilters(newFilters);
    fetchCosmetics(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchCosmetics(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchCosmetics(filters);
    message.success("Catálogo atualizado!");
  };

  const handleSyncShop = async () => {
    try {
      await syncShop("pt-BR");
      message.success("Loja sincronizada com sucesso!");
      fetchCosmetics(filters);
    } catch (err) {
      message.error("Erro ao sincronizar loja");
    }
  };

  const handleSelectCosmetic = (cosmetic: Cosmetic) => {
    setSelectedCosmetic(cosmetic);
    setPurchaseModalOpen(true);
  };

  const handleClosePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedCosmetic(null);
  };

  const handlePurchaseSuccess = async () => {
    await updateUser();
    await fetchPurchasedCosmetics();
    fetchCosmetics(filters);
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
          <Space direction="vertical" size="small">
            <Title level={2} style={{ margin: 0 }}>
              <ShoppingCartOutlined style={{ marginRight: 8 }} />
              Catálogo de Cosméticos
            </Title>
            <Text type="secondary">
              Explore e adquira cosméticos exclusivos do Fortnite
            </Text>
          </Space>
          <div style={{ marginTop: 16 }}>
            <Space wrap>
              <Button
                icon={<GiftOutlined />}
                onClick={() => router.push("/catalog/bundles")}
              >
                Ver Bundles
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Atualizar
              </Button>
            </Space>
          </div>
        </div>
        <CatalogFilters onFilter={handleFilter} loading={loading} />

        {loading && (!cosmetics || cosmetics.length === 0) ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "100px 0",
            }}
          >
            <Spin size="large" />
            <Text style={{ marginTop: 16 }} type="secondary">
              Carregando cosméticos...
            </Text>
          </div>
        ) : !cosmetics || cosmetics.length === 0 ? (
          <Empty
            description={
              <Space direction="vertical" size="large">
                <Text>Nenhum cosmético encontrado no banco de dados</Text>
                <Text type="secondary">
                  Sincronize a loja do Fortnite para carregar os cosméticos
                </Text>
              </Space>
            }
            style={{ padding: "100px 0" }}
          >
            <Space>
              <Button type="primary" onClick={handleSyncShop} loading={loading}>
                Sincronizar Loja
              </Button>
              <Button onClick={handleRefresh}>Recarregar</Button>
            </Space>
          </Empty>
        ) : (
          <>
            <div style={{ marginBottom: 16, textAlign: "right" }}>
              <Text type="secondary">
                Mostrando {cosmetics.length} de {total} cosméticos
              </Text>
            </div>

            <Row gutter={[16, 16]}>
              {cosmetics.map((cosmetic) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={cosmetic.id}>
                  <CosmeticCard
                    cosmetic={cosmetic}
                    onSelect={handleSelectCosmetic}
                    isPurchased={purchasedCosmeticIds.has(cosmetic.id)}
                  />
                </Col>
              ))}
            </Row>

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

      <PurchaseModal
        cosmetic={selectedCosmetic}
        open={purchaseModalOpen}
        userCredits={user?.credits || 0}
        onClose={handleClosePurchaseModal}
        onSuccess={handlePurchaseSuccess}
        isPurchased={
          selectedCosmetic
            ? purchasedCosmeticIds.has(selectedCosmetic.id)
            : false
        }
      />
    </AppLayout>
  );
}
