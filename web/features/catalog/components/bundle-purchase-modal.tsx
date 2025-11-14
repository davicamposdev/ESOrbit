"use client";

import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Button,
  App,
  Card,
  Row,
  Col,
} from "antd";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { type Bundle } from "../services";
import { financeService } from "@/shared";
import { calculateBundlePricing } from "../utils/bundle-pricing";

const { Text, Title } = Typography;

interface BundlePurchaseModalProps {
  bundle: Bundle | null;
  open: boolean;
  userCredits: number;
  onClose: () => void;
  onSuccess: () => void;
  isPurchased?: boolean;
}

export function BundlePurchaseModal({
  bundle,
  open,
  userCredits,
  onClose,
  onSuccess,
  isPurchased = false,
}: BundlePurchaseModalProps) {
  const { message, modal } = App.useApp();
  const [purchasing, setPurchasing] = useState(false);

  if (!bundle || !bundle.cosmetic) return null;

  // Verifica se todos os itens do bundle estão disponíveis
  const allItemsAvailable = bundle.items.every((item) => item.isAvailable);

  const pricing = calculateBundlePricing(bundle.items);
  const hasEnoughCredits = userCredits >= pricing.currentPrice;

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
            Você está prestes a comprar <strong>{bundle.name}</strong> por{" "}
            <strong>
              {pricing.currentPrice.toLocaleString("pt-BR")} V-Bucks
            </strong>
            .
          </p>
          <p>Este bundle contém {bundle.items.length} itens.</p>
          <p>
            Seu saldo após a compra será:{" "}
            <strong>
              {(userCredits - pricing.currentPrice).toLocaleString("pt-BR")}{" "}
              V-Bucks
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
          const response = await financeService.purchaseBundle(bundle.id);
          message.success(
            `Bundle comprado com sucesso! ${response.totalItems} itens adicionados à sua conta.`
          );
          onSuccess();
          onClose();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Erro ao comprar bundle";
          message.error(errorMessage);
        } finally {
          setPurchasing(false);
        }
      },
    });
  };

  return (
    <Modal
      title={
        <Space>
          <GiftOutlined />
          {bundle.name}
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
        allItemsAvailable && !isPurchased && (
          <Button
            key="buy"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handlePurchase}
            loading={purchasing}
            disabled={!hasEnoughCredits}
          >
            Comprar Bundle por {pricing.currentPrice.toLocaleString("pt-BR")}{" "}
            V-Bucks
          </Button>
        ),
      ]}
      width={800}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img
          src={bundle.cosmetic.imageUrl}
          alt={bundle.name}
          style={{
            maxWidth: "100%",
            maxHeight: 300,
            objectFit: "contain",
          }}
        />
      </div>

      <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Nome">{bundle.name}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Space>
            {isPurchased && <Tag color="blue">JÁ COMPRADO</Tag>}
            {bundle.cosmetic.isNew && <Tag color="green">NOVO</Tag>}
            {allItemsAvailable ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Disponível
              </Tag>
            ) : (
              <Tag color="error">Indisponível</Tag>
            )}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Quantidade de Itens">
          {bundle.items.length} itens inclusos
        </Descriptions.Item>
        {pricing.currentPrice > 0 && (
          <Descriptions.Item label="Preço do Bundle">
            {pricing.hasDiscount ? (
              <Space direction="vertical" size={4}>
                <Text delete type="secondary" style={{ fontSize: 14 }}>
                  {pricing.basePrice.toLocaleString("pt-BR")} V-Bucks
                </Text>
                <Space>
                  <Text strong style={{ color: "#52c41a", fontSize: 18 }}>
                    {pricing.currentPrice.toLocaleString("pt-BR")} V-Bucks
                  </Text>
                  <Tag color="success">
                    EM PROMOÇÃO (-{pricing.discountPercentage}%)
                  </Tag>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Economia de {pricing.discount.toLocaleString("pt-BR")} V-Bucks
                </Text>
              </Space>
            ) : (
              <Text strong style={{ fontSize: 18 }}>
                {pricing.currentPrice.toLocaleString("pt-BR")} V-Bucks
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
            {userCredits.toLocaleString("pt-BR")} V-Bucks
          </Text>
        </Descriptions.Item>
      </Descriptions>

      {!allItemsAvailable && !isPurchased && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            backgroundColor: "#fff1f0",
            borderRadius: 4,
            border: "1px solid #ffccc7",
          }}
        >
          <Text type="danger">
            Este bundle não pode ser comprado porque alguns itens não estão mais
            disponíveis.
          </Text>
        </div>
      )}

      {!hasEnoughCredits && allItemsAvailable && !isPurchased && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            backgroundColor: "#fff2e8",
            borderRadius: 4,
            border: "1px solid #ffbb96",
          }}
        >
          <Text type="warning">
            Você precisa de mais{" "}
            <strong>
              {(pricing.currentPrice - userCredits).toLocaleString("pt-BR")}{" "}
              V-Bucks
            </strong>{" "}
            para comprar este bundle.
          </Text>
        </div>
      )}

      <Title level={5}>Itens Inclusos:</Title>
      <Row gutter={[16, 16]}>
        {bundle.items.map((item) => (
          <Col xs={12} sm={8} md={6} key={item.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: "relative" }}>
                  <img
                    alt={item.name}
                    src={item.imageUrl}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                    }}
                  />
                  {!item.isAvailable && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Tag color="error">INDISPONÍVEL</Tag>
                    </div>
                  )}
                </div>
              }
              styles={{ body: { padding: "8px" } }}
            >
              <Text
                ellipsis
                style={{
                  fontSize: 12,
                  display: "block",
                  opacity: item.isAvailable ? 1 : 0.6,
                }}
                title={item.name}
              >
                {item.name}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
}
