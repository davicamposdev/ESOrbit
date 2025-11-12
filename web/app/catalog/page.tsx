"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  App,
  Modal,
  Descriptions,
  Tag,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/features/auth";
import {
  useCatalog,
  CatalogFilters,
  CosmeticCard,
  Pagination,
  type Cosmetic,
  type ListCosmeticsParams,
} from "@/features/catalog";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function CatalogPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { user, loading: authLoading } = useAuth();
  const {
    cosmetics,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchCosmetics,
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

  useEffect(() => {
    fetchCosmetics(filters);
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
  };

  const handleCloseModal = () => {
    setSelectedCosmetic(null);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  if (authLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            type="text"
          >
            Voltar
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            <ShoppingCartOutlined style={{ marginRight: 8 }} />
            Catálogo de Cosméticos
          </Title>
        </Space>
        <Space>
          {user && (
            <Text strong>
              Olá, {user.username}! | Créditos: {user.credits}
            </Text>
          )}
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Atualizar
          </Button>
        </Space>
      </Header>

      <Content
        style={{
          padding: "24px",
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
        }}
      >
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
      </Content>

      <Modal
        title={selectedCosmetic?.name}
        open={!!selectedCosmetic}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Fechar
          </Button>,
          selectedCosmetic?.isAvailable && (
            <Button key="buy" type="primary" icon={<ShoppingCartOutlined />}>
              Comprar
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedCosmetic && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img
                src={selectedCosmetic.imageUrl}
                alt={selectedCosmetic.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                }}
              />
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">
                {selectedCosmetic.externalId}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo">
                {selectedCosmetic.type}
              </Descriptions.Item>
              <Descriptions.Item label="Raridade">
                <Tag color="blue">{selectedCosmetic.rarity}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {selectedCosmetic.isNew && <Tag color="green">NOVO</Tag>}
                  {selectedCosmetic.isBundle && (
                    <Tag color="purple">BUNDLE</Tag>
                  )}
                  {selectedCosmetic.isAvailable ? (
                    <Tag color="success">Disponível</Tag>
                  ) : (
                    <Tag color="error">Indisponível</Tag>
                  )}
                </Space>
              </Descriptions.Item>
              {selectedCosmetic.currentPrice !== null && (
                <Descriptions.Item label="Preço">
                  {selectedCosmetic.basePrice !== null &&
                  selectedCosmetic.basePrice !==
                    selectedCosmetic.currentPrice ? (
                    <>
                      <Text delete type="secondary" style={{ marginRight: 8 }}>
                        {selectedCosmetic.basePrice} V-Bucks
                      </Text>
                      <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                        {selectedCosmetic.currentPrice} V-Bucks
                      </Text>
                    </>
                  ) : (
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedCosmetic.currentPrice} V-Bucks
                    </Text>
                  )}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Adicionado em">
                {new Date(selectedCosmetic.addedAt).toLocaleDateString("pt-BR")}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </Layout>
  );
}
