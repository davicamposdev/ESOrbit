"use client";

import { Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export function UsersInventoryHeader() {
  return (
    <div>
      <Title level={2}>
        <TrophyOutlined style={{ marginRight: 8 }} />
        Inventários dos Usuários
      </Title>
      <Text
        type="secondary"
        style={{ fontSize: 16, display: "block", marginBottom: 24 }}
      >
        Veja todos os itens que cada usuário possui
      </Text>
    </div>
  );
}
