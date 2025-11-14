"use client";

import {
  Row,
  Col,
  Card,
  Badge,
  Tag,
  Tooltip,
  Space,
  Empty,
  Button,
  Spin,
} from "antd";
import { AppstoreOutlined, ShoppingOutlined } from "@ant-design/icons";
import { type PurchaseResponse } from "@/shared";
import { Typography } from "antd";

const { Text } = Typography;

interface InventoryGridProps {
  purchases: PurchaseResponse[];
  allPurchases: PurchaseResponse[];
  loading: boolean;
  onItemClick: (purchase: PurchaseResponse) => void;
  onExploreCatalog: () => void;
}

const getRarityColor = (rarity: string) => {
  const colors: { [key: string]: string } = {
    COMMON: "#6c757d",
    UNCOMMON: "#28a745",
    RARE: "#007bff",
    EPIC: "#6f42c1",
    LEGENDARY: "#fd7e14",
    MYTHIC: "#ffc107",
  };
  return colors[rarity] || "#6c757d";
};

const getTypeIcon = () => {
  return <AppstoreOutlined />;
};

export function InventoryGrid({
  purchases,
  allPurchases,
  loading,
  onItemClick,
  onExploreCatalog,
}: InventoryGridProps) {
  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Carregando seu inventário...</Text>
          </div>
        </div>
      </Card>
    );
  }

  if (purchases.length === 0) {
    return (
      <Card>
        <Empty
          description={
            allPurchases.length === 0
              ? "Você ainda não possui itens no inventário"
              : "Nenhum item encontrado com os filtros aplicados"
          }
        >
          {allPurchases.length === 0 && (
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={onExploreCatalog}
            >
              Explorar Catálogo
            </Button>
          )}
        </Empty>
      </Card>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Exibindo {purchases.length} de {allPurchases.length} itens
        </Text>
      </div>
      <Row gutter={[16, 16]}>
        {purchases.map((purchase) => (
          <Col xs={24} sm={12} md={8} lg={6} key={purchase.id}>
            <Badge.Ribbon
              text={purchase.isFromBundle ? "Bundle" : "Individual"}
              color={purchase.isFromBundle ? "purple" : "blue"}
            >
              <Card
                hoverable
                onClick={() => onItemClick(purchase)}
                cover={
                  purchase.cosmetic?.imageUrl ? (
                    <div
                      style={{
                        position: "relative",
                        paddingTop: "100%",
                        overflow: "hidden",
                        background: `linear-gradient(135deg, ${getRarityColor(
                          purchase.cosmetic?.rarity || ""
                        )}22, ${getRarityColor(
                          purchase.cosmetic?.rarity || ""
                        )}44)`,
                      }}
                    >
                      <img
                        alt={purchase.cosmetic.name}
                        src={purchase.cosmetic.imageUrl}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f0f0f0",
                      }}
                    >
                      <AppstoreOutlined
                        style={{ fontSize: 48, color: "#ccc" }}
                      />
                    </div>
                  )
                }
                styles={{
                  body: { padding: "12px" },
                }}
              >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Tooltip title={purchase.cosmetic?.name}>
                    <Text
                      strong
                      ellipsis
                      style={{
                        fontSize: 14,
                        display: "block",
                      }}
                    >
                      {purchase.cosmetic?.name}
                    </Text>
                  </Tooltip>

                  <Space size={4} wrap>
                    <Tag
                      color={getRarityColor(purchase.cosmetic?.rarity || "")}
                      style={{ margin: 0, fontSize: 11 }}
                    >
                      {purchase.cosmetic?.rarity}
                    </Tag>
                    <Tag
                      icon={getTypeIcon()}
                      style={{ margin: 0, fontSize: 11 }}
                    >
                      {purchase.cosmetic?.type}
                    </Tag>
                  </Space>

                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Comprado em
                      </Text>
                      <Text style={{ fontSize: 11 }}>
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}
                      </Text>
                    </Space>
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Valor pago
                      </Text>
                      <Text strong style={{ fontSize: 12, color: "#52c41a" }}>
                        {purchase.transaction?.amount || 0} V-Bucks
                      </Text>
                    </Space>
                  </div>
                </Space>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </>
  );
}
