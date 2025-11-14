"use client";

import {
  Table,
  Space,
  Tag,
  Avatar,
  Typography,
  Empty,
  Spin,
  Button,
} from "antd";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { type PurchaseResponse } from "@/features/finance";

const { Text } = Typography;

interface PurchasesTableProps {
  purchases: PurchaseResponse[];
  loading: boolean;
  onExploreCatalog: () => void;
}

const getStatusTag = (status: string) => {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> =
    {
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

export function PurchasesTable({
  purchases,
  loading,
  onExploreCatalog,
}: PurchasesTableProps) {
  const columns = [
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
            <Avatar src={record.cosmetic.imageUrl} shape="square" size={40} />
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <Empty
        description="Nenhuma compra realizada"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" onClick={onExploreCatalog}>
          Explorar Catálogo
        </Button>
      </Empty>
    );
  }

  return (
    <Table
      dataSource={purchases}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total) => `Total de ${total} compras`,
      }}
    />
  );
}
