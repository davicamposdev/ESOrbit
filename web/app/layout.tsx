import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import ptBR from "antd/locale/pt_BR";
import { AntdReact19Setup } from "./antd-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESOrbit - Plataforma de E-commerce Moderna",
  description:
    "Plataforma completa de e-commerce com arquitetura limpa, segurança avançada e experiência excepcional. Sistema com autenticação JWT, catálogo flexível e controle financeiro integrado.",
  keywords: [
    "e-commerce",
    "loja virtual",
    "cosméticos",
    "plataforma de vendas",
    "ESOrbit",
  ],
  authors: [{ name: "ESOrbit Team" }],
  openGraph: {
    title: "ESOrbit - Plataforma de E-commerce Moderna",
    description:
      "A plataforma completa de e-commerce com arquitetura moderna e segurança avançada",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdReact19Setup />
        <AntdRegistry>
          <ConfigProvider
            locale={ptBR}
            theme={{
              token: {
                colorPrimary: "#2563eb",
                borderRadius: 8,
                fontFamily: "var(--font-geist-sans)",
              },
            }}
          >
            <App>
              <AuthProvider>{children}</AuthProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
