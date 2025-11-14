"use client";

import { Row, Col, Card, Statistic } from "antd";
import {
  WalletOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  FireOutlined,
} from "@ant-design/icons";

interface DashboardStatsProps {
  credits: number;
  totalPurchases: number;
  totalSpent: number;
  memberSince: string;
  loading?: boolean;
}

export function DashboardStats({
  credits,
  totalPurchases,
  totalSpent,
  memberSince,
  loading,
}: DashboardStatsProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Créditos Disponíveis"
            value={credits}
            prefix={<WalletOutlined />}
            valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
            suffix="V-Bucks"
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Total de Compras"
            value={totalPurchases}
            prefix={<ShoppingOutlined />}
            valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
            loading={loading}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Total Gasto"
            value={totalSpent}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: "#faad14", fontWeight: "bold" }}
            suffix="V-Bucks"
            loading={loading}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Membro desde"
            value={memberSince}
            prefix={<FireOutlined />}
            valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
