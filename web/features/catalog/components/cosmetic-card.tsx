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

export function CosmeticCard({ cosmetic, onSelect }: CosmeticCardProps) {
  const rarityColor = rarityColors[cosmetic.rarity.toLowerCase()] || "default";
  const rarityLabel =
    rarityLabels[cosmetic.rarity.toLowerCase()] || cosmetic.rarity;
  const typeLabel = typeLabels[cosmetic.type.toLowerCase()] || cosmetic.type;

  const handleClick = () => {
    if (onSelect) {
      onSelect(cosmetic);
    }
  };

  return (
    <Badge.Ribbon
      text={cosmetic.isNew ? "NOVO" : cosmetic.isBundle ? "BUNDLE" : undefined}
      color={cosmetic.isNew ? "green" : "purple"}
      style={{
        display: cosmetic.isNew || cosmetic.isBundle ? "block" : "none",
      }}
    >
      <Card
        hoverable
        onClick={handleClick}
        cover={
          <div style={{ position: "relative", paddingTop: "100%" }}>
            <img
              alt={cosmetic.name}
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
