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
      className="sticky top-0 z-1000 w-full flex items-center justify-between bg-white shadow-md px-6"
      style={{ background: "#fff" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ES</span>
          </div>
          <Text strong className="text-lg text-gray-800 whitespace-nowrap">
            ESOrbit
          </Text>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </div>

      <Space size="middle">
        {loading ? (
          <Avatar icon={<UserOutlined />} />
        ) : user ? (
          <>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-sm text-gray-800">
              <DollarCircleOutlined className="text-lg text-blue-600" />
              {user.credits.toLocaleString("pt-BR")}
            </div>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <Text strong className="max-w-[150px]">
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
