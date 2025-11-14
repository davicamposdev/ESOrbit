"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/shared";
import {
  Card,
  Descriptions,
  Typography,
  Space,
  Button,
  Spin,
  Tag,
  Avatar,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  WalletOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header do Perfil */}
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
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%" }}
              >
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
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  />
                </div>
                <Title
                  level={2}
                  style={{ margin: "16px 0 0 0", color: "white" }}
                >
                  {user.username}
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    margin: "4px 0",
                    fontSize: "16px",
                  }}
                >
                  {user.email}
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
                  {user.credits} V-Bucks
                </Tag>
              </Space>
            </div>
          </Card>

          {/* Informações da Conta */}
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
                  {user.id}
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
                {user.username}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined style={{ color: "#667eea" }} />
                    <span>Email</span>
                  </Space>
                }
              >
                {user.email}
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
                  {user.credits} V-Bucks
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
                {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Atividade */}
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

          {/* Ações */}
          <Space style={{ width: "100%", justifyContent: "center" }} wrap>
            <Button
              onClick={() => router.push("/dashboard")}
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
              onClick={() => router.push("/catalog")}
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
        </Space>
      </div>
    </AppLayout>
  );
}
