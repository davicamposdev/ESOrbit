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
  Card,
} from "antd";
import {
  ShoppingCartOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  GiftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/features/auth";
import {
  useBundles,
  BundleCard,
  Pagination,
  BundleFilters,
  type Bundle,
  type ListBundlesParams,
} from "@/features/catalog";
import { financeService } from "@/features/finance";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function BundlesPage() {
  const router = useRouter();
  const { message, modal } = App.useApp();
  const { user, loading: authLoading, refreshAuth } = useAuth();
  const {
    bundles,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchBundles,
    clearError,
  } = useBundles();

  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [filters, setFilters] = useState<ListBundlesParams>({
    page: 1,
    pageSize: 20,
    isAvailable: true,
  });

  useEffect(() => {
    fetchBundles(filters);
  }, []);

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
  };

  const handleCloseModal = () => {
    setSelectedBundle(null);
  };

  const handlePurchase = async () => {
    if (!selectedBundle || !user || !selectedBundle.cosmetic) return;

    if (user.credits < (selectedBundle.cosmetic.currentPrice || 0)) {
      message.error("Créditos insuficientes para esta compra!");
      return;
    }

    modal.confirm({
      title: "Confirmar Compra",
      content: (
        <div>
          <p>
            Você está prestes a comprar <strong>{selectedBundle.name}</strong>{" "}
            por <strong>{selectedBundle.cosmetic.currentPrice} V-Bucks</strong>.
          </p>
          <p>Este bundle contém {selectedBundle.items.length} itens.</p>
          <p>Deseja continuar?</p>
        </div>
      ),
      okText: "Sim, comprar",
      cancelText: "Cancelar",
      onOk: async () => {
        setPurchasing(true);
        try {
          const response = await financeService.purchaseBundle(
            selectedBundle.id
          );
          message.success(
            `Bundle comprado com sucesso! ${response.totalItems} itens adicionados à sua conta.`
          );
          await refreshAuth();
          handleCloseModal();
          handleRefresh();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erro ao comprar bundle";
          message.error(errorMessage);
        } finally {
          setPurchasing(false);
        }
      },
    });
  };

  const handleGoBack = () => {
    router.push("/catalog");
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
            <GiftOutlined style={{ marginRight: 8 }} />
            Bundles Disponíveis
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
        <BundleFilters onFilter={handleFilter} loading={loading} />

        {loading && (!bundles || bundles.length === 0) ? (
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
              Carregando bundles...
            </Text>
          </div>
        ) : !bundles || bundles.length === 0 ? (
          <Empty
            description={
              <Space direction="vertical" size="large">
                <Text>Nenhum bundle disponível no momento</Text>
                <Text type="secondary">
                  Verifique novamente mais tarde ou sincronize a loja
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

            <Row gutter={[16, 16]}>
              {bundles.map((bundle) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={bundle.id}>
                  <BundleCard bundle={bundle} onSelect={handleSelectBundle} />
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
        title={
          <Space>
            <GiftOutlined />
            {selectedBundle?.name}
          </Space>
        }
        open={!!selectedBundle}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Fechar
          </Button>,
          selectedBundle?.cosmetic?.isAvailable && (
            <Button
              key="buy"
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handlePurchase}
              loading={purchasing}
              disabled={
                !user ||
                !selectedBundle?.cosmetic ||
                user.credits < (selectedBundle?.cosmetic?.currentPrice || 0)
              }
            >
              Comprar Bundle
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedBundle && selectedBundle.cosmetic && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img
                src={selectedBundle.cosmetic.imageUrl}
                alt={selectedBundle.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                }}
              />
            </div>

            <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Nome">
                {selectedBundle.name}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Space>
                  {selectedBundle.cosmetic.isNew && (
                    <Tag color="green">NOVO</Tag>
                  )}
                  {selectedBundle.cosmetic.isAvailable ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Disponível
                    </Tag>
                  ) : (
                    <Tag color="error">Indisponível</Tag>
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Quantidade de Itens">
                {selectedBundle.items.length} itens inclusos
              </Descriptions.Item>
              {selectedBundle.cosmetic.currentPrice !== null && (
                <Descriptions.Item label="Preço">
                  {selectedBundle.cosmetic.basePrice !== null &&
                  selectedBundle.cosmetic.basePrice !==
                    selectedBundle.cosmetic.currentPrice ? (
                    <>
                      <Text delete type="secondary" style={{ marginRight: 8 }}>
                        {selectedBundle.cosmetic.basePrice} V-Bucks
                      </Text>
                      <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                        {selectedBundle.cosmetic.currentPrice} V-Bucks
                      </Text>
                      <Tag color="success" style={{ marginLeft: 8 }}>
                        EM PROMOÇÃO
                      </Tag>
                    </>
                  ) : (
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedBundle.cosmetic.currentPrice} V-Bucks
                    </Text>
                  )}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Title level={5}>Itens Inclusos:</Title>
            <Row gutter={[16, 16]}>
              {selectedBundle.items.map((item) => (
                <Col xs={12} sm={8} md={6} key={item.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={item.name}
                        src={item.imageUrl}
                        style={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                        }}
                      />
                    }
                    styles={{ body: { padding: "8px" } }}
                  >
                    <Text
                      ellipsis
                      style={{ fontSize: 12, display: "block" }}
                      title={item.name}
                    >
                      {item.name}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Modal>
    </Layout>
  );
}
