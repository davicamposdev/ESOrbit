"use client";

import { Card, Tag, Badge, Typography } from "antd";
import {
  StarOutlined,
  GiftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { type Cosmetic } from "../services";

const { Text, Title } = Typography;

interface CosmeticCardProps {
  cosmetic: Cosmetic;
  onSelect?: (cosmetic: Cosmetic) => void;
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

const typeLabels: Record<string, string> = {
  outfit: "Roupa",
  emote: "Emote",
  glider: "Planador",
  pickaxe: "Picareta",
  backpack: "Mochila",
  wrap: "Revestimento",
  contrail: "Rastro",
  loadingscreen: "Tela de Carregamento",
  music: "Música",
  spray: "Spray",
  toy: "Brinquedo",
  pet: "Pet",
  banner: "Banner",
  emoji: "Emoji",
};

export function CosmeticCard({
  cosmetic,
  onSelect,
  isPurchased = false,
}: CosmeticCardProps) {
  const rarityColor = rarityColors[cosmetic.rarity.toLowerCase()] || "default";
  const rarityLabel =
    rarityLabels[cosmetic.rarity.toLowerCase()] || cosmetic.rarity;
  const typeLabel = typeLabels[cosmetic.type.toLowerCase()] || cosmetic.type;

  const handleClick = () => {
    if (onSelect) {
      onSelect(cosmetic);
    }
  };

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

  return (
    <Badge.Ribbon
      text={
        isPurchased
          ? "COMPRADO"
          : cosmetic.isNew
          ? "NOVO"
          : cosmetic.isBundle
          ? "BUNDLE"
          : undefined
      }
      color={isPurchased ? "blue" : cosmetic.isNew ? "green" : "purple"}
      style={{
        display:
          isPurchased || cosmetic.isNew || cosmetic.isBundle ? "block" : "none",
      }}
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
              alt={cosmetic.name}
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
                      <StarOutlined /> JÁ COMPRADO
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
          <Text type="secondary" style={{ fontSize: 12 }}>
            {typeLabel}
          </Text>
        </div>

        <Title
          level={5}
          ellipsis={{ rows: 1 }}
          style={{ marginBottom: 8, marginTop: 0 }}
        >
          {cosmetic.name}
        </Title>

        {cosmetic.currentPrice !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {cosmetic.basePrice !== null &&
            cosmetic.basePrice !== cosmetic.currentPrice ? (
              <>
                <Text
                  delete
                  type="secondary"
                  style={{ fontSize: 13, lineHeight: 1 }}
                >
                  {cosmetic.basePrice} V-Bucks
                </Text>
                <Text
                  strong
                  style={{ fontSize: 18, color: "#52c41a", lineHeight: 1 }}
                >
                  {cosmetic.currentPrice} V-Bucks
                </Text>
              </>
            ) : (
              <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                {cosmetic.currentPrice} V-Bucks
              </Text>
            )}
          </div>
        )}
      </Card>
    </Badge.Ribbon>
  );
}
