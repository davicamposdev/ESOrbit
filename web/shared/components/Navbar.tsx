"use client";

import { useAuth } from "@/features/auth";
import { useRouter, usePathname } from "next/navigation";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  LoginOutlined,
  WalletOutlined,
  GiftOutlined,
  DollarCircleOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;
const { Text } = Typography;

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Perfil",
      onClick: () => router.push("/profile"),
    },
    {
      key: "credits",
      icon: <WalletOutlined />,
      label: (
        <Space>
          <Text>Créditos:</Text>
          <Text strong>{user?.credits || 0}</Text>
        </Space>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "transactions",
      icon: <WalletOutlined />,
      label: "Transações",
      onClick: () => router.push("/transactions"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sair",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <UnorderedListOutlined />,
      label: "Início",
      onClick: () => router.push("/"),
    },
    {
      key: "/catalog",
      icon: <ShoppingOutlined />,
      label: "Catálogo",
      onClick: () => router.push("/catalog"),
    },
    {
      key: "/catalog/bundles",
      icon: <GiftOutlined />,
      label: "Bundles",
      onClick: () => router.push("/catalog/bundles"),
    },
    {
      key: "/users-inventory",
      icon: <UserOutlined />,
      label: "Inventários",
      onClick: () => router.push("/users-inventory"),
    },
  ];

  if (user) {
    menuItems.push({
      key: "/dashboard",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
      onClick: () => router.push("/dashboard"),
    });
  }

  const selectedKey = pathname === "/" ? "/" : pathname;

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              ES
            </span>
          </div>
          <Text
            strong
            style={{ fontSize: 18, color: "#1f2937", whiteSpace: "nowrap" }}
          >
            ESOrbit
          </Text>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            background: "transparent",
          }}
        />
      </div>

      <Space size="middle">
        {loading ? (
          <Avatar icon={<UserOutlined />} />
        ) : user ? (
          <>
            {/* Créditos (V-Bucks) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                fontWeight: 600,
                fontSize: 14,
                color: "#1f2937",
              }}
            >
              <DollarCircleOutlined
                style={{ fontSize: 18, color: "#2563eb" }}
              />
              {user.credits.toLocaleString("pt-BR")}
            </div>

            {/* --- Dropdown do usuário --- */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                <Text strong style={{ maxWidth: 150 }}>
                  {user.username}
                </Text>
              </Space>
            </Dropdown>
          </>
        ) : (
          <Space>
            <Button
              icon={<LoginOutlined />}
              onClick={() => router.push("/login")}
            >
              Entrar
            </Button>
            <Button type="primary" onClick={() => router.push("/register")}>
              Criar conta
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
}
