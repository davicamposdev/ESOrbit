"use client";

import { Card, Typography } from "antd";

const { Paragraph } = Typography;

export function RecentActivityCard() {
  return (
    <Card
      title={
        <span style={{ fontSize: "18px", fontWeight: 600 }}>
          Atividade Recente
        </span>
      }
      variant="borderless"
      style={{
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Paragraph
        type="secondary"
        style={{
          textAlign: "center",
          margin: "24px 0",
          fontSize: "15px",
        }}
      >
        Nenhuma atividade recente para exibir.
      </Paragraph>
    </Card>
  );
}
