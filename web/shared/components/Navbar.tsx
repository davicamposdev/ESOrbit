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
      className="sticky top-0 z-1000 w-full flex items-center justify-between bg-white shadow-lg px-6 border-b-2 border-gray-100"
      style={{ background: "#fff" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => router.push("/")}
        >
          <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">ES</span>
          </div>
          <Text
            strong
            className="text-2xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap"
          >
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
          <Avatar icon={<UserOutlined />} size={40} />
        ) : user ? (
          <>
            <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl font-bold text-base text-gray-800 shadow-sm">
              <DollarCircleOutlined className="text-xl text-green-600" />
              <span className="text-green-700">
                {user.credits.toLocaleString("pt-BR")}
              </span>
            </div>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar
                  icon={<UserOutlined />}
                  size={40}
                  className="bg-linear-to-br from-blue-600 to-indigo-600"
                />
                <Text strong className="max-w-[150px] text-base">
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
              size="large"
              className="h-11 font-semibold"
            >
              Entrar
            </Button>
            <Button
              type="primary"
              onClick={() => router.push("/register")}
              size="large"
              className="h-11 font-semibold"
            >
              Criar conta
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
}
