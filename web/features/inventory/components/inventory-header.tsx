"use client";

import { Typography, Button } from "antd";
import { AppstoreOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface InventoryHeaderProps {
  onBack: () => void;
}

export function InventoryHeader({ onBack }: InventoryHeaderProps) {
  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
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
  );
}
