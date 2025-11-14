"use client";

import { Card, List, Space, Tag, Avatar, Button, Spin } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { type PurchaseResponse } from "@/features/finance";

const { Text } = Typography;
import { Typography } from "antd";

interface RecentPurchasesProps {
  purchases: PurchaseResponse[];
  loading: boolean;
  onViewAll: () => void;
  onExploreCatalog: () => void;
}

export function RecentPurchases({
  purchases,
  loading,
  onViewAll,
  onExploreCatalog,
}: RecentPurchasesProps) {
  return (
    <Card
      title="Compras Recentes"
      className="border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      style={{ height: "100%" }}
      extra={
        <Button type="link" onClick={onViewAll}>
          Ver todas
        </Button>
      }
    >
      <div>
        {loading ? (
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
              onClick={onExploreCatalog}
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
                        {new Date(purchase.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text strong style={{ color: "#52c41a" }}>
                        {purchase.transaction?.amount || 0} V-Bucks
                      </Text>
                      {purchase.cosmetic?.type && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {purchase.cosmetic.type} • {purchase.cosmetic.rarity}
                        </Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Card>
  );
}
