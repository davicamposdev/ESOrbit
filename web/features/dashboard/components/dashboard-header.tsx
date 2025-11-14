"use client";

import { Typography } from "antd";

const { Title, Paragraph } = Typography;

interface DashboardHeaderProps {
  username: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 shadow-2xl mb-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
        <Title level={2} style={{ color: "white", margin: 0 }}>
          Bem-vindo, {username}! 👋
        </Title>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.9)",
            margin: "8px 0 0 0",
            fontSize: "16px",
          }}
        >
          Gerencie sua conta e explore nosso catálogo de cosméticos do Fortnite
        </Paragraph>
      </div>
    </div>
  );
}
