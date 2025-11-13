"use client";

import { Card, Tag, Badge, Typography, Row, Col, Space, Tooltip } from "antd";
import { GiftOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { type Bundle } from "../services";
import { calculateBundlePricing } from "../utils/bundle-pricing";

const { Text, Title } = Typography;

interface BundleCardProps {
  bundle: Bundle;
  onSelect?: (bundle: Bundle) => void;
  isPurchased?: boolean;
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

export function BundleCard({
  bundle,
  onSelect,
  isPurchased = false,
}: BundleCardProps) {
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

  const rarityBorderColors: Record<string, string> = {
    common: "#95a5a6",
    uncommon: "#2ecc71",
    rare: "#3498db",
    epic: "#9b59b6",
    legendary: "#f39c12",
    mythic: "#e74c3c",
    marvel: "#e74c3c",
    dc: "#3498db",
    icon: "#17a2b8",
    starwars: "#95a5a6",
    gaminglegends: "#9b59b6",
    shadow: "#95a5a6",
    slurp: "#17a2b8",
    dark: "#9b59b6",
    frozen: "#3498db",
    lava: "#fd7e14",
    platform: "#3498db",
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(bundle);
    }
  };

  return (
    <Badge.Ribbon
      text={isPurchased ? "COMPRADO" : cosmetic.isNew ? "NOVO" : "BUNDLE"}
      color={isPurchased ? "blue" : cosmetic.isNew ? "green" : "purple"}
    >
      <Card
        hoverable
        onClick={handleClick}
        style={{
          opacity: isPurchased ? 0.85 : 1,
          borderColor:
            rarityBorderColors[cosmetic.rarity.toLowerCase()] || "#d9d9d9",
          borderWidth: 2,
        }}
        cover={
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              overflow: "hidden",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                objectFit: "contain",
              }}
            />
            {(!cosmetic.isAvailable || isPurchased) && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isPurchased
                    ? "rgba(24, 144, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.6)",
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
                  {isPurchased ? (
                    <>
                      <GiftOutlined /> JÁ COMPRADO
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined /> INDISPONÍVEL
                    </>
                  )}
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
