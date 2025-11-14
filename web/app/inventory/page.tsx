"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout, ItemFilters, type ItemFiltersConfig } from "@/shared";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Spin,
  App,
  Empty,
  Badge,
  Tag,
  Tooltip,
  Statistic,
  Modal,
  Divider,
  Descriptions,
} from "antd";
import {
  AppstoreOutlined,
  FilterOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { financeService, type PurchaseResponse } from "@/features/finance";

const { Title, Text, Paragraph } = Typography;

export default function InventoryPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const { message, modal } = App.useApp();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<
    PurchaseResponse[]
  >([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseResponse | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !loading) {
      loadInventory();
    }
  }, [user, loading]);

  useEffect(() => {
    setFilteredPurchases(purchases);
  }, [purchases]);

  const loadInventory = async () => {
    setLoadingPurchases(true);
    try {
      const data = await financeService.listPurchases({ status: "ACTIVE" });
      setPurchases(data);
    } catch (error) {
      console.error("Erro ao carregar inventário:", error);
      message.error("Erro ao carregar seu inventário");
      setPurchases([]);
    } finally {
      setLoadingPurchases(false);
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

    // Filtrar por texto de busca
    if (filters.name) {
      filtered = filtered.filter((purchase) =>
        purchase.cosmetic?.name
          ?.toLowerCase()
          .includes(filters.name!.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.cosmetic?.type?.toLowerCase() === filters.type?.toLowerCase()
      );
    }

    // Filtrar por raridade
    if (filters.rarity) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.cosmetic?.rarity?.toLowerCase() ===
          filters.rarity?.toLowerCase()
      );
    }

    setFilteredPurchases(filtered);
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      COMMON: "#6c757d",
      UNCOMMON: "#28a745",
      RARE: "#007bff",
      EPIC: "#6f42c1",
      LEGENDARY: "#fd7e14",
      MYTHIC: "#ffc107",
    };
    return colors[rarity] || "#6c757d";
  };

  const getTypeIcon = (type: string) => {
    return <AppstoreOutlined />;
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
      icon: <ExclamationCircleOutlined />,
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
          // Recarrega o inventário e atualiza os créditos do usuário
          await Promise.all([loadInventory(), updateUser()]);
        } catch (error: any) {
          console.error("Erro ao devolver cosmético:", error);
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

  const stats = calculateStats();

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
          {/* Header */}
          <div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/dashboard")}
              size="large"
              className="h-12 font-semibold mb-4"
            >
              Voltar ao Dashboard
            </Button>
            <div className="bg-linear-to-br from-orange-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  <AppstoreOutlined /> Meu Inventário
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    margin: "8px 0 0 0",
                    fontSize: "16px",
                  }}
                >
                  Todos os itens que você comprou e possui atualmente
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
                <Statistic
                  title="Total de Itens"
                  value={stats.totalItems}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
                <Statistic
                  title="Tipos Únicos"
                  value={stats.uniqueTypes}
                  prefix={<FilterOutlined />}
                  valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
                <Statistic
                  title="Valor Total Investido"
                  value={stats.totalValue}
                  prefix={<TrophyOutlined />}
                  suffix="V-Bucks"
                  valueStyle={{ color: "#faad14", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filtros */}
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
            loading={loadingPurchases}
          />

          {/* Grid de Itens */}
          {loadingPurchases ? (
            <Card>
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Carregando seu inventário...</Text>
                </div>
              </div>
            </Card>
          ) : filteredPurchases.length === 0 ? (
            <Card>
              <Empty
                description={
                  purchases.length === 0
                    ? "Você ainda não possui itens no inventário"
                    : "Nenhum item encontrado com os filtros aplicados"
                }
              >
                {purchases.length === 0 && (
                  <Button
                    type="primary"
                    icon={<ShoppingOutlined />}
                    onClick={() => router.push("/catalog")}
                  >
                    Explorar Catálogo
                  </Button>
                )}
              </Empty>
            </Card>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">
                  Exibindo {filteredPurchases.length} de {purchases.length}{" "}
                  itens
                </Text>
              </div>
              <Row gutter={[16, 16]}>
                {filteredPurchases.map((purchase) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={purchase.id}>
                    <Badge.Ribbon
                      text={purchase.isFromBundle ? "Bundle" : "Individual"}
                      color={purchase.isFromBundle ? "purple" : "blue"}
                    >
                      <Card
                        hoverable
                        onClick={() => handleViewDetails(purchase)}
                        cover={
                          purchase.cosmetic?.imageUrl ? (
                            <div
                              style={{
                                position: "relative",
                                paddingTop: "100%",
                                overflow: "hidden",
                                background: `linear-gradient(135deg, ${getRarityColor(
                                  purchase.cosmetic?.rarity || ""
                                )}22, ${getRarityColor(
                                  purchase.cosmetic?.rarity || ""
                                )}44)`,
                              }}
                            >
                              <img
                                alt={purchase.cosmetic.name}
                                src={purchase.cosmetic.imageUrl}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f0f0f0",
                              }}
                            >
                              <AppstoreOutlined
                                style={{ fontSize: 48, color: "#ccc" }}
                              />
                            </div>
                          )
                        }
                        styles={{
                          body: { padding: "12px" },
                        }}
                      >
                        <Space
                          direction="vertical"
                          size={4}
                          style={{ width: "100%" }}
                        >
                          <Tooltip title={purchase.cosmetic?.name}>
                            <Text
                              strong
                              ellipsis
                              style={{
                                fontSize: 14,
                                display: "block",
                              }}
                            >
                              {purchase.cosmetic?.name}
                            </Text>
                          </Tooltip>

                          <Space size={4} wrap>
                            <Tag
                              color={getRarityColor(
                                purchase.cosmetic?.rarity || ""
                              )}
                              style={{ margin: 0, fontSize: 11 }}
                            >
                              {purchase.cosmetic?.rarity}
                            </Tag>
                            <Tag
                              icon={getTypeIcon(purchase.cosmetic?.type || "")}
                              style={{ margin: 0, fontSize: 11 }}
                            >
                              {purchase.cosmetic?.type}
                            </Tag>
                          </Space>

                          <div
                            style={{
                              marginTop: 8,
                              paddingTop: 8,
                              borderTop: "1px solid #f0f0f0",
                            }}
                          >
                            <Space
                              style={{
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                Comprado em
                              </Text>
                              <Text style={{ fontSize: 11 }}>
                                {new Date(
                                  purchase.createdAt
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </Text>
                            </Space>
                            <Space
                              style={{
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                Valor pago
                              </Text>
                              <Text
                                strong
                                style={{ fontSize: 12, color: "#52c41a" }}
                              >
                                {purchase.transaction?.amount || 0} V-Bucks
                              </Text>
                            </Space>
                          </div>
                        </Space>
                      </Card>
                    </Badge.Ribbon>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Space>
      </div>

      {/* Modal de Detalhes do Item */}
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        style={{ top: 20 }}
      >
        {selectedPurchase && (
          <div>
            {/* Header com imagem */}
            <div
              style={{
                position: "relative",
                height: 300,
                marginBottom: 24,
                borderRadius: 8,
                overflow: "hidden",
                background: `linear-gradient(135deg, ${getRarityColor(
                  selectedPurchase.cosmetic?.rarity || ""
                )}33, ${getRarityColor(
                  selectedPurchase.cosmetic?.rarity || ""
                )}66)`,
              }}
            >
              {selectedPurchase.cosmetic?.imageUrl ? (
                <img
                  src={selectedPurchase.cosmetic.imageUrl}
                  alt={selectedPurchase.cosmetic.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <AppstoreOutlined style={{ fontSize: 80, color: "#ccc" }} />
                </div>
              )}
              {selectedPurchase.isFromBundle && (
                <Badge.Ribbon
                  text="Bundle"
                  color="purple"
                  style={{ top: 10, right: 10 }}
                />
              )}
            </div>

            {/* Título e Tags */}
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Title level={3} style={{ marginBottom: 8 }}>
                  {selectedPurchase.cosmetic?.name}
                </Title>
                <Space size={8} wrap>
                  <Tag
                    color={getRarityColor(
                      selectedPurchase.cosmetic?.rarity || ""
                    )}
                    style={{ fontSize: 13, padding: "4px 12px" }}
                  >
                    {selectedPurchase.cosmetic?.rarity}
                  </Tag>
                  <Tag
                    icon={getTypeIcon(selectedPurchase.cosmetic?.type || "")}
                    style={{ fontSize: 13, padding: "4px 12px" }}
                  >
                    {selectedPurchase.cosmetic?.type}
                  </Tag>
                  {selectedPurchase.status === "ACTIVE" && (
                    <Tag
                      color="success"
                      style={{ fontSize: 13, padding: "4px 12px" }}
                    >
                      Ativo
                    </Tag>
                  )}
                </Space>
              </div>

              {/* Descrição */}
              {selectedPurchase.cosmetic?.description && (
                <div>
                  <Paragraph type="secondary">
                    {selectedPurchase.cosmetic.description}
                  </Paragraph>
                </div>
              )}

              <Divider />

              {/* Detalhes da Compra */}
              <Descriptions column={1} size="small">
                <Descriptions.Item label="ID da Compra">
                  <Text copyable style={{ fontSize: 12 }}>
                    {selectedPurchase.id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Data da Compra">
                  {new Date(selectedPurchase.createdAt).toLocaleString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Pago">
                  <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                    {selectedPurchase.transaction?.amount || 0} V-Bucks
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Origem">
                  {selectedPurchase.isFromBundle
                    ? "Comprado como parte de um Bundle"
                    : "Compra individual"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    color={
                      selectedPurchase.status === "ACTIVE"
                        ? "success"
                        : "warning"
                    }
                  >
                    {selectedPurchase.status}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {/* Preço Atual do Item */}
              {selectedPurchase.cosmetic?.finalPrice && (
                <>
                  <Divider />
                  <div>
                    <Text type="secondary">Preço atual no catálogo:</Text>
                    <div style={{ marginTop: 8 }}>
                      {selectedPurchase.cosmetic.onSale &&
                      selectedPurchase.cosmetic.regularPrice !==
                        selectedPurchase.cosmetic.finalPrice ? (
                        <Space>
                          <Text
                            delete
                            type="secondary"
                            style={{ fontSize: 14 }}
                          >
                            {selectedPurchase.cosmetic.regularPrice} V-Bucks
                          </Text>
                          <Text
                            strong
                            style={{ fontSize: 18, color: "#ff4d4f" }}
                          >
                            {selectedPurchase.cosmetic.finalPrice} V-Bucks
                          </Text>
                          <Tag color="red">Em Promoção</Tag>
                        </Space>
                      ) : (
                        <Text strong style={{ fontSize: 18 }}>
                          {selectedPurchase.cosmetic.finalPrice} V-Bucks
                        </Text>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Divider />

              {/* Botões de Ação */}
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseModal}>Fechar</Button>
                <Button
                  type="primary"
                  danger
                  icon={<RollbackOutlined />}
                  onClick={handleReturnCosmetic}
                  loading={isReturning}
                >
                  Devolver Item
                </Button>
              </Space>
            </Space>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
