"use client";

import { Table, Tag, Typography, Empty, Spin } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { type TransferResponse } from "@/shared";

const { Text } = Typography;

interface TransfersTableProps {
  transfers: TransferResponse[];
  loading: boolean;
  userId?: string;
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

export function TransfersTable({
  transfers,
  loading,
  userId,
}: TransfersTableProps) {
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
      title: "Tipo",
      key: "type",
      render: (_: any, record: TransferResponse) => {
        const isSent = record.fromUserId === userId;
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
        const isSent = record.fromUserId === userId;
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <Empty
        description="Nenhuma transferência realizada"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Table
      dataSource={transfers}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        showTotal: (total) => `Total de ${total} transferências`,
      }}
    />
  );
}
