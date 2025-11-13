"use client";

import { Card, Tag, Badge, Typography, Row, Col, Space, Tooltip } from "antd";
import { GiftOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { type Bundle } from "../services";
import { calculateBundlePricing } from "../utils/bundle-pricing";

const { Text, Title } = Typography;

interface BundleCardProps {
  bundle: Bundle;
  onSelect?: (bundle: Bundle) => void;
}

const rarityColors: Record<string, string> = {
  common: "default",
  uncommon: "success",
  rare: "processing",
  epic: "purple",
  legendary: "gold",
  marvel: "error",
  dc: "blue",
  icon: "cyan",
  starwars: "default",
  gaminglegends: "purple",
  shadow: "default",
  slurp: "cyan",
  dark: "purple",
  frozen: "blue",
  lava: "orange",
  platform: "processing",
};

const rarityLabels: Record<string, string> = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
  marvel: "Marvel",
  dc: "DC",
  icon: "Ícone",
  starwars: "Star Wars",
  gaminglegends: "Gaming Legends",
  shadow: "Sombra",
  slurp: "Slurp",
  dark: "Escuro",
  frozen: "Congelado",
  lava: "Lava",
  platform: "Plataforma",
};

export function BundleCard({ bundle, onSelect }: BundleCardProps) {
  // Fallback para casos onde o cosmetic pode estar indefinido
  const cosmetic = bundle.cosmetic;
  if (!cosmetic) {
    return null;
  }

  // Calcula os preços do bundle baseado nos itens
  const pricing = calculateBundlePricing(bundle.items);

  const rarityColor = rarityColors[cosmetic.rarity.toLowerCase()] || "default";
  const rarityLabel =
    rarityLabels[cosmetic.rarity.toLowerCase()] || cosmetic.rarity;

  const handleClick = () => {
    if (onSelect) {
      onSelect(bundle);
    }
  };

  return (
    <Badge.Ribbon
      text={cosmetic.isNew ? "NOVO" : "BUNDLE"}
      color={cosmetic.isNew ? "green" : "purple"}
    >
      <Card
        hoverable
        onClick={handleClick}
        cover={
          <div
            style={{
              position: "relative",
              paddingTop: "100%",
              backgroundColor: "#2d2d2d",
            }}
          >
            <img
              alt={bundle.name}
              src={cosmetic.imageUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {!cosmetic.isAvailable && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  strong
                  style={{
                    color: "white",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <CloseCircleOutlined /> INDISPONÍVEL
                </Text>
              </div>
            )}
          </div>
        }
        styles={{ body: { padding: "12px 16px" } }}
      >
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tag color={rarityColor}>{rarityLabel}</Tag>
          <Space size={4}>
            <GiftOutlined style={{ fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {bundle.items.length} itens
            </Text>
          </Space>
        </div>

        <Title
          level={5}
          ellipsis={{ rows: 1 }}
          style={{ marginBottom: 8, marginTop: 0 }}
        >
          {bundle.name}
        </Title>

        {bundle.items.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <Row gutter={[4, 4]}>
              {bundle.items.slice(0, 3).map((item) => (
                <Col span={8} key={item.id}>
                  <Tooltip title={item.name}>
                    <div
                      style={{
                        backgroundColor: "#2a2a2a",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: 60,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </Tooltip>
                </Col>
              ))}
            </Row>
            {bundle.items.length > 3 && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                +{bundle.items.length - 3} itens
              </Text>
            )}
          </div>
        )}

        {pricing.currentPrice > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {pricing.hasDiscount ? (
              <>
                <Text
                  delete
                  type="secondary"
                  style={{ fontSize: 13, lineHeight: 1 }}
                >
                  {pricing.basePrice.toLocaleString("pt-BR")} V-Bucks
                </Text>
                <Space size={4} style={{ flexWrap: "wrap" }}>
                  <Text
                    strong
                    style={{ fontSize: 18, color: "#52c41a", lineHeight: 1 }}
                  >
                    {pricing.currentPrice.toLocaleString("pt-BR")} V-Bucks
                  </Text>
                  <Tag color="success" style={{ margin: 0 }}>
                    -{pricing.discountPercentage}%
                  </Tag>
                </Space>
              </>
            ) : (
              <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                {pricing.currentPrice.toLocaleString("pt-BR")} V-Bucks
              </Text>
            )}
          </div>
        )}
      </Card>
    </Badge.Ribbon>
  );
}
