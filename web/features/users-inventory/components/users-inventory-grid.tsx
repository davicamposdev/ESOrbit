"use client";

import { Row, Col, Card, Avatar, Space, Tag, Empty } from "antd";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import { type UserWithCosmetics } from "@/features/auth/services/users.service";
import { Typography } from "antd";
import Image from "next/image";

const { Text } = Typography;

const rarityColors: Record<string, string> = {
  common: "#95a5a6",
  uncommon: "#2ecc71",
  rare: "#3498db",
  epic: "#9b59b6",
  legendary: "#f39c12",
  mythic: "#e74c3c",
};

interface UsersInventoryGridProps {
  users: UserWithCosmetics[];
}

export function UsersInventoryGrid({ users }: UsersInventoryGridProps) {
  if (users.length === 0) {
    return (
      <Empty
        description="Nenhum usuário encontrado"
        style={{ marginTop: 48 }}
      />
    );
  }

  return (
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
  );
}
