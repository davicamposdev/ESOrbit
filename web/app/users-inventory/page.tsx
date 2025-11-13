"use client";

import { useEffect, useState } from "react";
import {
  usersService,
  type UserWithCosmetics,
} from "@/features/auth/services/users.service";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Empty,
  Spin,
  Tag,
  Space,
  Divider,
} from "antd";
import { UserOutlined, TrophyOutlined } from "@ant-design/icons";
import Image from "next/image";
import { AppLayout } from "@/shared";

const { Title, Text } = Typography;

const rarityColors: Record<string, string> = {
  common: "#95a5a6",
  uncommon: "#2ecc71",
  rare: "#3498db",
  epic: "#9b59b6",
  legendary: "#f39c12",
  mythic: "#e74c3c",
};

export default function UsersInventoryPage() {
  const [users, setUsers] = useState<UserWithCosmetics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.listAllWithCosmetics();
      setUsers(response.users);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Empty description={error} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: "24px" }}>
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

        <Row gutter={[16, 16]}>
          {users.map((user) => (
            <Col xs={24} key={user.id}>
              <Card
                title={
                  <Space>
                    <Avatar icon={<UserOutlined />} size="large" />
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600 }}>
                        {user.username}
                      </div>
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        {user.cosmetics.length} ite
                        {user.cosmetics.length !== 1 ? "ns" : "m"}
                      </Text>
                    </div>
                  </Space>
                }
              >
                {user.cosmetics.length === 0 ? (
                  <Empty description="Nenhum item ainda" />
                ) : (
                  <Row gutter={[12, 12]}>
                    {user.cosmetics.map((cosmetic) => (
                      <Col xs={12} sm={8} md={6} lg={4} key={cosmetic.id}>
                        <Card
                          hoverable
                          style={{
                            borderColor:
                              rarityColors[cosmetic.rarity.toLowerCase()] ||
                              "#d9d9d9",
                            borderWidth: 2,
                          }}
                          cover={
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                paddingTop: "100%",
                                overflow: "hidden",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              }}
                            >
                              <Image
                                src={cosmetic.imageUrl}
                                alt={cosmetic.name}
                                fill
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                          }
                        >
                          <Card.Meta
                            title={
                              <Text
                                ellipsis={{ tooltip: cosmetic.name }}
                                style={{ fontSize: 12 }}
                              >
                                {cosmetic.name}
                              </Text>
                            }
                            description={
                              <Space
                                direction="vertical"
                                size={4}
                                style={{ width: "100%" }}
                              >
                                <Tag
                                  color={
                                    rarityColors[cosmetic.rarity.toLowerCase()]
                                  }
                                  style={{ fontSize: 10, margin: 0 }}
                                >
                                  {cosmetic.rarity}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 10 }}>
                                  {cosmetic.type}
                                </Text>
                              </Space>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {users.length === 0 && (
          <Empty
            description="Nenhum usuário encontrado"
            style={{ marginTop: 48 }}
          />
        )}
      </div>
    </AppLayout>
  );
}
