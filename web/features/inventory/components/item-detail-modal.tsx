"use client";

import { Modal, Space, Tag, Badge, Divider, Descriptions, Button } from "antd";
import { AppstoreOutlined, RollbackOutlined } from "@ant-design/icons";
import { type PurchaseResponse } from "@/features/finance";
import { Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

interface ItemDetailModalProps {
  purchase: PurchaseResponse | null;
  visible: boolean;
  returning: boolean;
  onClose: () => void;
  onReturn: () => void;
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

export function ItemDetailModal({
  purchase,
  visible,
  returning,
  onClose,
  onReturn,
}: ItemDetailModalProps) {
  if (!purchase) return null;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      style={{ top: 20 }}
    >
      <div>
        <div
          style={{
            position: "relative",
            height: 300,
            marginBottom: 24,
            borderRadius: 8,
            overflow: "hidden",
            background: `linear-gradient(135deg, ${getRarityColor(
              purchase.cosmetic?.rarity || ""
            )}33, ${getRarityColor(purchase.cosmetic?.rarity || "")}66)`,
          }}
        >
          {purchase.cosmetic?.imageUrl ? (
            <img
              src={purchase.cosmetic.imageUrl}
              alt={purchase.cosmetic.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <AppstoreOutlined style={{ fontSize: 80, color: "#ccc" }} />
            </div>
          )}
          {purchase.isFromBundle && (
            <Badge.Ribbon
              text="Bundle"
              color="purple"
              style={{ top: 10, right: 10 }}
            />
          )}
        </div>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>
              {purchase.cosmetic?.name}
            </Title>
            <Space size={8} wrap>
              <Tag
                color={getRarityColor(purchase.cosmetic?.rarity || "")}
                style={{ fontSize: 13, padding: "4px 12px" }}
              >
                {purchase.cosmetic?.rarity}
              </Tag>
              <Tag
                icon={getTypeIcon()}
                style={{ fontSize: 13, padding: "4px 12px" }}
              >
                {purchase.cosmetic?.type}
              </Tag>
              {purchase.status === "ACTIVE" && (
                <Tag
                  color="success"
                  style={{ fontSize: 13, padding: "4px 12px" }}
                >
                  Ativo
                </Tag>
              )}
            </Space>
          </div>

          {purchase.cosmetic?.description && (
            <div>
              <Paragraph type="secondary">
                {purchase.cosmetic.description}
              </Paragraph>
            </div>
          )}

          <Divider />

          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID da Compra">
              <Text copyable style={{ fontSize: 12 }}>
                {purchase.id}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Data da Compra">
              {new Date(purchase.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Valor Pago">
              <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                {purchase.transaction?.amount || 0} V-Bucks
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Origem">
              {purchase.isFromBundle
                ? "Comprado como parte de um Bundle"
                : "Compra individual"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={purchase.status === "ACTIVE" ? "success" : "warning"}>
                {purchase.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {purchase.cosmetic?.finalPrice && (
            <>
              <Divider />
              <div>
                <Text type="secondary">Preço atual no catálogo:</Text>
                <div style={{ marginTop: 8 }}>
                  {purchase.cosmetic.onSale &&
                  purchase.cosmetic.regularPrice !==
                    purchase.cosmetic.finalPrice ? (
                    <Space>
                      <Text delete type="secondary" style={{ fontSize: 14 }}>
                        {purchase.cosmetic.regularPrice} V-Bucks
                      </Text>
                      <Text strong style={{ fontSize: 18, color: "#ff4d4f" }}>
                        {purchase.cosmetic.finalPrice} V-Bucks
                      </Text>
                      <Tag color="red">Em Promoção</Tag>
                    </Space>
                  ) : (
                    <Text strong style={{ fontSize: 18 }}>
                      {purchase.cosmetic.finalPrice} V-Bucks
                    </Text>
                  )}
                </div>
              </div>
            </>
          )}

          <Divider />

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Fechar</Button>
            <Button
              type="primary"
              danger
              icon={<RollbackOutlined />}
              onClick={onReturn}
              loading={returning}
            >
              Devolver Item
            </Button>
          </Space>
        </Space>
      </div>
    </Modal>
  );
}
