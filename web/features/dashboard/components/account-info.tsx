"use client";

import { Card, Space } from "antd";
import { Typography } from "antd";

const { Paragraph } = Typography;

interface AccountInfoProps {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export function AccountInfo({
  id,
  email,
  username,
  createdAt,
}: AccountInfoProps) {
  return (
    <Card
      title="Informações da Conta"
      className="border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all"
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div>
          <Paragraph strong>ID do Usuário</Paragraph>
          <Paragraph copyable>{id}</Paragraph>
        </div>
        <div>
          <Paragraph strong>Email</Paragraph>
          <Paragraph>{email}</Paragraph>
        </div>
        <div>
          <Paragraph strong>Nome de Usuário</Paragraph>
          <Paragraph>{username}</Paragraph>
        </div>
        <div>
          <Paragraph strong>Membro desde</Paragraph>
          <Paragraph>
            {new Date(createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
}
