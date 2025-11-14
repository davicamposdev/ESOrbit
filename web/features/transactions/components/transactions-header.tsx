"use client";

import { Typography, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface TransactionsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function TransactionsHeader({
  loading,
  onRefresh,
}: TransactionsHeaderProps) {
  return (
    <div className="bg-linear-to-br from-green-500 to-cyan-600 rounded-3xl p-8 shadow-2xl">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0, color: "white" }}>
              Histórico de Transações
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
              Acompanhe suas compras e transferências
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            size="large"
            className="h-12 font-semibold"
            style={{ backgroundColor: "white" }}
          >
            Atualizar
          </Button>
        </div>
      </div>
    </div>
  );
}
