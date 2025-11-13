"use client";

import { Modal, Descriptions, Tag, Space, Typography, Button, App } from "antd";
import { ShoppingCartOutlined, GiftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { type Cosmetic } from "../services";
import { financeService } from "@/features/finance";

const { Text } = Typography;

interface PurchaseModalProps {
  cosmetic: Cosmetic | null;
  open: boolean;
  userCredits: number;
  onClose: () => void;
  onSuccess: () => void;
  isPurchased?: boolean;
}

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

export function PurchaseModal({
  cosmetic,
  open,
  userCredits,
  onClose,
  onSuccess,
  isPurchased = false,
}: PurchaseModalProps) {
  const { message, modal } = App.useApp();
  const [purchasing, setPurchasing] = useState(false);

  if (!cosmetic) return null;

  const rarityLabel =
    rarityLabels[cosmetic.rarity.toLowerCase()] || cosmetic.rarity;
  const typeLabel = typeLabels[cosmetic.type.toLowerCase()] || cosmetic.type;
  const hasEnoughCredits = userCredits >= (cosmetic.currentPrice || 0);

  const handlePurchase = () => {
    if (!hasEnoughCredits) {
      message.error("Créditos insuficientes para esta compra!");
      return;
    }

    modal.confirm({
      title: "Confirmar Compra",
      content: (
        <div>
          <p>
            Você está prestes a comprar <strong>{cosmetic.name}</strong> por{" "}
            <strong>{cosmetic.currentPrice} V-Bucks</strong>.
          </p>
          <p>
            Seu saldo após a compra será:{" "}
            <strong>
              {userCredits - (cosmetic.currentPrice || 0)} V-Bucks
            </strong>
          </p>
          <p>Deseja continuar?</p>
        </div>
      ),
      okText: "Sim, comprar",
      cancelText: "Cancelar",
      onOk: async () => {
        setPurchasing(true);
        try {
          await financeService.purchaseCosmetic(cosmetic.id);
          message.success("Cosmético comprado com sucesso!");
          onSuccess();
          onClose();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erro ao comprar cosmético";
          message.error(errorMessage);
        } finally {
          setPurchasing(false);
        }
      },
    });
  };

  return (
    <Modal
      title={cosmetic.name}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
        cosmetic.isAvailable && !isPurchased && (
          <Button
            key="buy"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handlePurchase}
            loading={purchasing}
            disabled={!hasEnoughCredits}
          >
            Comprar por {cosmetic.currentPrice} V-Bucks
          </Button>
        ),
      ]}
      width={600}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img
          src={cosmetic.imageUrl}
          alt={cosmetic.name}
          style={{
            maxWidth: "100%",
            maxHeight: 300,
            objectFit: "contain",
          }}
        />
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{cosmetic.externalId}</Descriptions.Item>
        <Descriptions.Item label="Tipo">{typeLabel}</Descriptions.Item>
        <Descriptions.Item label="Raridade">
          <Tag color="blue">{rarityLabel}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Space>
            {isPurchased && <Tag color="blue">JÁ COMPRADO</Tag>}
            {cosmetic.isNew && <Tag color="green">NOVO</Tag>}
            {cosmetic.isBundle && <Tag color="purple">BUNDLE</Tag>}
            {cosmetic.isAvailable ? (
              <Tag color="success">Disponível</Tag>
            ) : (
              <Tag color="error">Indisponível</Tag>
            )}
          </Space>
        </Descriptions.Item>
        {cosmetic.currentPrice !== null && (
          <Descriptions.Item label="Preço">
            {cosmetic.basePrice !== null &&
            cosmetic.basePrice !== cosmetic.currentPrice ? (
              <>
                <Text delete type="secondary" style={{ marginRight: 8 }}>
                  {cosmetic.basePrice} V-Bucks
                </Text>
                <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                  {cosmetic.currentPrice} V-Bucks
                </Text>
              </>
            ) : (
              <Text strong style={{ fontSize: 16 }}>
                {cosmetic.currentPrice} V-Bucks
              </Text>
            )}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Seus créditos">
          <Text
            strong
            style={{
              fontSize: 16,
              color: hasEnoughCredits ? "#52c41a" : "#ff4d4f",
            }}
          >
            {userCredits} V-Bucks
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Adicionado em">
          {new Date(cosmetic.addedAt).toLocaleDateString("pt-BR")}
        </Descriptions.Item>
      </Descriptions>

      {!hasEnoughCredits && cosmetic.isAvailable && !isPurchased && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#fff2e8",
            borderRadius: 4,
            border: "1px solid #ffbb96",
          }}
        >
          <Text type="warning">
            Você precisa de mais{" "}
            <strong>
              {(cosmetic.currentPrice || 0) - userCredits} V-Bucks
            </strong>{" "}
            para comprar este cosmético.
          </Text>
        </div>
      )}
    </Modal>
  );
}
