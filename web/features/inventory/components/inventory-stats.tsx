"use client";

import { Row, Col, Card, Statistic } from "antd";
import {
  AppstoreOutlined,
  FilterOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

interface InventoryStatsProps {
  totalItems: number;
  uniqueTypes: number;
  totalValue: number;
}

export function InventoryStats({
  totalItems,
  uniqueTypes,
  totalValue,
}: InventoryStatsProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Total de Itens"
            value={totalItems}
            prefix={<AppstoreOutlined />}
            valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Tipos Únicos"
            value={uniqueTypes}
            prefix={<FilterOutlined />}
            valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 rounded-2xl">
          <Statistic
            title="Valor Total Investido"
            value={totalValue}
            prefix={<TrophyOutlined />}
            suffix="V-Bucks"
            valueStyle={{ color: "#faad14", fontWeight: "bold" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
