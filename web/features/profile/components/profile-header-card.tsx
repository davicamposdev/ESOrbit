"use client";

import { Card, Space, Avatar, Typography, Tag } from "antd";
import { UserOutlined, WalletOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface ProfileHeaderCardProps {
  username: string;
  email: string;
  credits: number;
}

export function ProfileHeaderCard({
  username,
  email,
  credits,
}: ProfileHeaderCardProps) {
  return (
    <Card
      variant="borderless"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "32px 24px",
        }}
      >
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              padding: "4px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            }}
          >
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
          </div>
          <Title level={2} style={{ margin: "16px 0 0 0", color: "white" }}>
            {username}
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.95)",
              margin: "4px 0",
              fontSize: "16px",
            }}
          >
            {email}
          </Paragraph>
          <Tag
            color="success"
            icon={<WalletOutlined />}
            style={{
              fontSize: "16px",
              padding: "8px 20px",
              marginTop: "12px",
              borderRadius: "20px",
              border: "none",
              fontWeight: 600,
            }}
          >
            {credits} V-Bucks
          </Tag>
        </Space>
      </div>
    </Card>
  );
}
