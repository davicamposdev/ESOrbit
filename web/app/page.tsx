"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário está autenticado, redireciona para o dashboard
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
    return null; // Vai redirecionar
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          ESOrbit
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          Sistema de E-commerce com autenticação JWT e arquitetura limpa
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-blue-600 dark:border-blue-400"
          >
            Criar conta
          </Link>
        </div>

        <div className="mt-16 text-sm text-gray-500 dark:text-gray-400">
          <p>Recursos implementados:</p>
          <ul className="mt-2 space-y-1">
            <li>✅ Autenticação JWT com Refresh Tokens</li>
            <li>✅ Cookies HttpOnly para segurança</li>
            <li>✅ Proteção de rotas</li>
            <li>✅ Integração completa com API NestJS</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
