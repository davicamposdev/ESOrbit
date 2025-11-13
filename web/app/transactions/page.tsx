"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout } from "@/shared";
import {
  Card,
  Table,
  Typography,
  Space,
  Button,
  Spin,
  Tag,
  Tabs,
  Empty,
  App,
} from "antd";
import {
  ShoppingOutlined,
  SwapOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  financeService,
  type PurchaseResponse,
  type TransferResponse,
} from "@/features/finance";

const { Title, Text } = Typography;

export default function TransactionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { message } = App.useApp();
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [transfers, setTransfers] = useState<TransferResponse[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [activeTab, setActiveTab] = useState("purchases");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadPurchases();
      loadTransfers();
    }
  }, [user]);

  const loadPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const data = await financeService.listPurchases({ limit: 100 });
      setPurchases(data);
    } catch (error) {
      message.error("Erro ao carregar compras");
      console.error(error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const loadTransfers = async () => {
    setLoadingTransfers(true);
    try {
      const data = await financeService.listTransfers({ limit: 100 });
      setTransfers(data);
    } catch (error) {
      message.error("Erro ao carregar transferências");
      console.error(error);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "purchases") {
      loadPurchases();
    } else {
      loadTransfers();
    }
    message.success("Dados atualizados!");
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: React.ReactNode }
    > = {
      completed: { color: "success", icon: <CheckCircleOutlined /> },
      pending: { color: "processing", icon: <ClockCircleOutlined /> },
      failed: { color: "error", icon: <CloseCircleOutlined /> },
      cancelled: { color: "default", icon: <CloseCircleOutlined /> },
    };

    const config = statusConfig[status.toLowerCase()] || {
      color: "default",
      icon: <ClockCircleOutlined />,
    };

    return (
      <Tag color={config.color} icon={config.icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  const purchaseColumns = [
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      width: 150,
    },
    {
      title: "Cosmético",
      dataIndex: ["cosmetic", "name"],
      key: "cosmetic",
      render: (_: string, record: PurchaseResponse) => (
        <Space>
          {record.cosmetic?.imageUrl && (
            <img
              src={record.cosmetic.imageUrl}
              alt={record.cosmetic.name}
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          )}
          <Space direction="vertical" size={0}>
            <Text strong>{record.cosmetic?.name || "Desconhecido"}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.cosmetic?.type} - {record.cosmetic?.rarity}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Valor",
      dataIndex: ["transaction", "amount"],
      key: "amount",
      render: (amount: number) => (
        <Text strong>{amount?.toLocaleString("pt-BR")} V-Bucks</Text>
      ),
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
      width: 120,
    },
  ];

  const transferColumns = [
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      width: 150,
    },
    {
      title: "Tipo",
      key: "type",
      render: (_: any, record: TransferResponse) => {
        const isSent = record.fromUserId === user?.id;
        return (
          <Tag color={isSent ? "red" : "green"}>
            {isSent ? "Enviado" : "Recebido"}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: (description: string) => description || "-",
    },
    {
      title: "Valor",
      dataIndex: ["transaction", "amount"],
      key: "amount",
      render: (amount: number, record: TransferResponse) => {
        const isSent = record.fromUserId === user?.id;
        return (
          <Text strong style={{ color: isSent ? "#ff4d4f" : "#52c41a" }}>
            {isSent ? "-" : "+"}
            {amount?.toLocaleString("pt-BR")} V-Bucks
          </Text>
        );
      },
      width: 150,
    },
    {
      title: "Status",
      dataIndex: ["transaction", "status"],
      key: "status",
      render: (status: string) => getStatusTag(status),
      width: 120,
    },
  ];

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Histórico de Transações
              </Title>
              <Text type="secondary">
                Acompanhe suas compras e transferências
              </Text>
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loadingPurchases || loadingTransfers}
            >
              Atualizar
            </Button>
          </div>

          <Card>
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
                  children: loadingPurchases ? (
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                      <Spin size="large" />
                    </div>
                  ) : purchases.length === 0 ? (
                    <Empty
                      description="Nenhuma compra realizada"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button
                        type="primary"
                        onClick={() => router.push("/catalog")}
                      >
                        Explorar Catálogo
                      </Button>
                    </Empty>
                  ) : (
                    <Table
                      dataSource={purchases}
                      columns={purchaseColumns}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => `Total de ${total} compras`,
                      }}
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
                  children: loadingTransfers ? (
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                      <Spin size="large" />
                    </div>
                  ) : transfers.length === 0 ? (
                    <Empty
                      description="Nenhuma transferência realizada"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    <Table
                      dataSource={transfers}
                      columns={transferColumns}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) =>
                          `Total de ${total} transferências`,
                      }}
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
