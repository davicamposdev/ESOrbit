"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout } from "@/shared";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Spin,
  App,
  List,
  Tag,
  Avatar,
} from "antd";
import {
  WalletOutlined,
  ShoppingOutlined,
  UserOutlined,
  GiftOutlined,
  HistoryOutlined,
  TrophyOutlined,
  FireOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { financeService, type PurchaseResponse } from "@/features/finance";

const { Title, Paragraph, Text } = Typography;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    console.log("Dashboard - user:", user, "loading:", loading);
    if (!loading && !user) {
      console.log("Redirecionando para login...");
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !loading) {
      loadRecentPurchases();
    }
  }, [user, loading]);

  const loadRecentPurchases = async () => {
    console.log("Carregando compras recentes...");
    setLoadingPurchases(true);
    try {
      const data = await financeService.listPurchases({ limit: 5 });
      console.log("Compras carregadas:", data);
      setPurchases(data);
    } catch (error) {
      console.error("Erro ao carregar compras:", error);
      // Não mostrar erro, apenas deixar vazio
      setPurchases([]);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const calculateStats = () => {
    const totalSpent = purchases.reduce(
      (sum, purchase) => sum + (purchase.transaction?.amount || 0),
      0
    );
    const totalPurchases = purchases.length;
    return { totalSpent, totalPurchases };
  };

  const { totalSpent, totalPurchases } = calculateStats();

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
          <div>
            <Title level={2}>Bem-vindo, {user.username}! 👋</Title>
            <Paragraph type="secondary">
              Gerencie sua conta e explore nosso catálogo de cosméticos do
              Fortnite
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Créditos Disponíveis"
                  value={user.credits}
                  prefix={<WalletOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                  suffix="V-Bucks"
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total de Compras"
                  value={totalPurchases}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                  loading={loadingPurchases}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Gasto"
                  value={totalSpent}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: "#faad14" }}
                  suffix="V-Bucks"
                  loading={loadingPurchases}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Membro desde"
                  value={new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                  prefix={<FireOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Informações da Conta">
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <div>
                    <Paragraph strong>ID do Usuário</Paragraph>
                    <Paragraph copyable>{user.id}</Paragraph>
                  </div>
                  <div>
                    <Paragraph strong>Email</Paragraph>
                    <Paragraph>{user.email}</Paragraph>
                  </div>
                  <div>
                    <Paragraph strong>Nome de Usuário</Paragraph>
                    <Paragraph>{user.username}</Paragraph>
                  </div>
                  <div>
                    <Paragraph strong>Membro desde</Paragraph>
                    <Paragraph>
                      {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="Compras Recentes"
                extra={
                  <Button
                    type="link"
                    onClick={() => router.push("/transactions")}
                  >
                    Ver todas
                  </Button>
                }
              >
                {loadingPurchases ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Spin />
                  </div>
                ) : purchases.length === 0 ? (
                  <Space
                    direction="vertical"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    <Text type="secondary">Nenhuma compra realizada ainda</Text>
                    <Button
                      type="primary"
                      icon={<ShoppingOutlined />}
                      onClick={() => router.push("/catalog")}
                    >
                      Explorar Catálogo
                    </Button>
                  </Space>
                ) : (
                  <List
                    dataSource={purchases}
                    renderItem={(purchase) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            purchase.cosmetic?.imageUrl ? (
                              <Avatar
                                src={purchase.cosmetic.imageUrl}
                                shape="square"
                                size={48}
                              />
                            ) : (
                              <Avatar icon={<ShoppingOutlined />} size={48} />
                            )
                          }
                          title={
                            <Space>
                              <Text strong>
                                {purchase.cosmetic?.name || "Cosmético"}
                              </Text>
                              {purchase.status === "ACTIVE" && (
                                <Tag color="success">Ativo</Tag>
                              )}
                              {purchase.status === "RETURNED" && (
                                <Tag color="warning">Devolvido</Tag>
                              )}
                              {purchase.isFromBundle && (
                                <Tag color="purple">Bundle</Tag>
                              )}
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={0}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {new Date(purchase.createdAt).toLocaleString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Text>
                              <Text strong style={{ color: "#52c41a" }}>
                                {purchase.transaction?.amount || 0} V-Bucks
                              </Text>
                              {purchase.cosmetic?.type && (
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  {purchase.cosmetic.type} •{" "}
                                  {purchase.cosmetic.rarity}
                                </Text>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card>
                <Title level={4}>Sobre o ESOrbit</Title>
                <Paragraph>
                  Bem-vindo à plataforma ESOrbit! Aqui você pode explorar e
                  adquirir cosméticos do Fortnite usando seus créditos V-Bucks.
                  Nossa plataforma oferece um catálogo completo com skins,
                  emotes, picaretas e muito mais.
                </Paragraph>
                <Paragraph>
                  Navegue pelo catálogo para descobrir novos itens ou confira
                  nossos bundles especiais para economizar!
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Ações Rápidas">
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Button
                    type="primary"
                    icon={<ShoppingOutlined />}
                    size="large"
                    block
                    onClick={() => router.push("/catalog")}
                  >
                    Explorar Catálogo
                  </Button>
                  <Button
                    icon={<AppstoreOutlined />}
                    size="large"
                    block
                    onClick={() => router.push("/inventory")}
                  >
                    Meu Inventário
                  </Button>
                  <Button
                    icon={<GiftOutlined />}
                    size="large"
                    block
                    onClick={() => router.push("/catalog/bundles")}
                  >
                    Ver Bundles
                  </Button>
                  <Button
                    icon={<UserOutlined />}
                    size="large"
                    block
                    onClick={() => router.push("/profile")}
                  >
                    Ver Perfil
                  </Button>
                  <Button
                    icon={<HistoryOutlined />}
                    size="large"
                    block
                    onClick={() => router.push("/transactions")}
                  >
                    Ver Transações
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </div>
    </AppLayout>
  );
}
