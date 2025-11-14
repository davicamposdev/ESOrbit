"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <Link
        href="/"
        className="absolute top-8 left-8 z-50 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors group"
      >
        <HomeOutlined className="text-lg group-hover:scale-110 transition-transform" />
        <span>Voltar ao Início</span>
      </Link>
      {children}
    </div>
  );
}
