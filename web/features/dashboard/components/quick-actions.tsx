"use client";

import { Card, Space, Button } from "antd";
import {
  ShoppingOutlined,
  AppstoreOutlined,
  GiftOutlined,
  UserOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

interface QuickActionsProps {
  onExploreCatalog: () => void;
  onViewInventory: () => void;
  onViewBundles: () => void;
  onViewProfile: () => void;
  onViewTransactions: () => void;
}

export function QuickActions({
  onExploreCatalog,
  onViewInventory,
  onViewBundles,
  onViewProfile,
  onViewTransactions,
}: QuickActionsProps) {
  return (
    <Card
      title="Ações Rápidas"
      className="border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      style={{ height: "100%" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          size="large"
          block
          onClick={onExploreCatalog}
          className="h-14 text-base font-semibold"
        >
          Explorar Catálogo
        </Button>
        <Button
          icon={<AppstoreOutlined />}
          size="large"
          block
          onClick={onViewInventory}
          className="h-14 text-base font-semibold"
        >
          Meu Inventário
        </Button>
        <Button
          icon={<GiftOutlined />}
          size="large"
          block
          onClick={onViewBundles}
          className="h-14 text-base font-semibold"
        >
          Ver Bundles
        </Button>
        <Button
          icon={<UserOutlined />}
          size="large"
          block
          onClick={onViewProfile}
          className="h-14 text-base font-semibold"
        >
          Ver Perfil
        </Button>
        <Button
          icon={<HistoryOutlined />}
          size="large"
          block
          onClick={onViewTransactions}
          className="h-14 text-base font-semibold"
        >
          Ver Transações
        </Button>
      </Space>
    </Card>
  );
}
