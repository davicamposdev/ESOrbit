"use client";

import { Space, Button } from "antd";

interface ProfileActionsProps {
  onBackToDashboard: () => void;
  onExploreCatalog: () => void;
}

export function ProfileActions({
  onBackToDashboard,
  onExploreCatalog,
}: ProfileActionsProps) {
  return (
    <Space style={{ width: "100%", justifyContent: "center" }} wrap>
      <Button
        onClick={onBackToDashboard}
        size="large"
        style={{
          height: "48px",
          borderRadius: "12px",
          fontWeight: 500,
          minWidth: "160px",
        }}
      >
        Voltar ao Dashboard
      </Button>
      <Button
        type="primary"
        onClick={onExploreCatalog}
        size="large"
        style={{
          height: "48px",
          borderRadius: "12px",
          fontWeight: 500,
          minWidth: "160px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
        }}
      >
        Explorar Catálogo
      </Button>
    </Space>
  );
}
