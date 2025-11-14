"use client";

import { Card, Descriptions, Space, Typography, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  WalletOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

const { Paragraph } = Typography;

interface AccountInfoCardProps {
  id: string;
  username: string;
  email: string;
  credits: number;
  createdAt: string;
}

export function AccountInfoCard({
  id,
  username,
  email,
  credits,
  createdAt,
}: AccountInfoCardProps) {
  return (
    <Card
      title={
        <span style={{ fontSize: "18px", fontWeight: 600 }}>
          Informações da Conta
        </span>
      }
      variant="borderless"
      style={{
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      extra={
        <Button icon={<EditOutlined />} type="text">
          Editar
        </Button>
      }
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item
          label={
            <Space>
              <UserOutlined style={{ color: "#667eea" }} />
              <span>ID do Usuário</span>
            </Space>
          }
        >
          <Paragraph copyable style={{ margin: 0 }}>
            {id}
          </Paragraph>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Space>
              <UserOutlined style={{ color: "#667eea" }} />
              <span>Nome de Usuário</span>
            </Space>
          }
        >
          {username}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Space>
              <MailOutlined style={{ color: "#667eea" }} />
              <span>Email</span>
            </Space>
          }
        >
          {email}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Space>
              <WalletOutlined style={{ color: "#667eea" }} />
              <span>Créditos</span>
            </Space>
          }
        >
          <Tag
            color="success"
            style={{
              fontSize: "14px",
              padding: "4px 12px",
              borderRadius: "12px",
              fontWeight: 500,
            }}
          >
            {credits} V-Bucks
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Space>
              <CalendarOutlined style={{ color: "#667eea" }} />
              <span>Conta Criada</span>
            </Space>
          }
        >
          {new Date(createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
