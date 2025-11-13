"use client";

import { Layout } from "antd";
import { Navbar } from "../components";
import { ReactNode } from "react";

const { Content, Footer } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ background: "#f5f5f5" }}>{children}</Content>
      <Footer
        style={{ textAlign: "center", background: "#001529", color: "#fff" }}
      >
        ESOrbit ©{new Date().getFullYear()} - Plataforma de E-commerce Moderna
      </Footer>
    </Layout>
  );
}
