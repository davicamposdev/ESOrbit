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
          <Card className="bg-linear-to-br from-blue-500 to-indigo-600 border-0 shadow-2xl rounded-3xl">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6">
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%" }}
              >
                <div className="bg-white rounded-full p-2 shadow-xl">
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    className="bg-linear-to-br from-blue-600 to-indigo-600"
                  />
                </div>
                <Title level={2} style={{ margin: 0, color: "white" }}>
                  {user.username}
                </Title>
                <Paragraph
                  style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}
                >
                  {user.email}
                </Paragraph>
                <Tag
                  color="green"
                  icon={<WalletOutlined />}
                  style={{
                    fontSize: "16px",
                    padding: "8px 16px",
                    marginTop: "8px",
                  }}
                >
                  {user.credits} V-Bucks
                </Tag>
              </Space>
            </div>
          </Card>

          <Card
            title="Informações da Conta"
            className="border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
                    <UserOutlined />
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
                    <UserOutlined />
                    <span>Nome de Usuário</span>
                  </Space>
                }
              >
                {user.username}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    <span>Email</span>
                  </Space>
                }
              >
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <WalletOutlined />
                    <span>Créditos</span>
                  </Space>
                }
              >
                <Tag color="green">{user.credits} V-Bucks</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <CalendarOutlined />
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

          <Card
            title="Atividade"
            className="border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Paragraph type="secondary">
              Nenhuma atividade recente para exibir.
            </Paragraph>
          </Card>

          <Space>
            <Button
              onClick={() => router.push("/dashboard")}
              size="large"
              className="h-12 font-semibold"
            >
              Voltar ao Dashboard
            </Button>
            <Button
              type="primary"
              onClick={() => router.push("/catalog")}
              size="large"
              className="h-12 font-semibold"
            >
              Explorar Catálogo
            </Button>
          </Space>
        </Space>
      </div>
    </AppLayout>
  );
}
