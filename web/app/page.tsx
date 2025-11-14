"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "antd";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">ES</span>
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ESOrbit
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Recursos
            </a>
            <Link
              href="/catalog"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Catálogo
            </Link>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Sobre
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button type="text" size="large" className="font-semibold">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button type="primary" size="large" className="font-semibold">
                Criar conta
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Plataforma moderna e segura
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                Bem-vindo ao
                <span className="block mt-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ESOrbit
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A plataforma completa de e-commerce com arquitetura limpa,
                segurança avançada e experiência excepcional para seus clientes.
                Gerencie seu catálogo, transações e muito mais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register" className="flex-1">
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="h-16 text-lg font-bold px-10 min-w-[220px]"
                  >
                    Começar agora →
                  </Button>
                </Link>
                <Link href="/catalog" className="flex-1">
                  <Button
                    size="large"
                    block
                    className="h-16 text-lg font-bold px-10 min-w-[220px]"
                  >
                    Ver Catálogo
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600 mt-1">Seguro</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">
                    Clean
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Arquitetura</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">Fast</div>
                  <div className="text-sm text-gray-600 mt-1">Performance</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-semibold">
                        Sistema Online
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">Tempo real</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/30 backdrop-blur rounded-xl p-6 h-36 flex flex-col justify-between">
                      <div className="text-white/80 text-sm">
                        Total de Vendas
                      </div>
                      <div className="text-white text-2xl font-bold">
                        R$ 125k
                      </div>
                    </div>
                    <div className="bg-white/30 backdrop-blur rounded-xl p-6 h-36 flex flex-col justify-between">
                      <div className="text-white/80 text-sm">Produtos</div>
                      <div className="text-white text-2xl font-bold">1.2k+</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-14 bg-white/30 backdrop-blur rounded-xl flex items-center px-4">
                      <span className="text-white text-sm">
                        Dashboard intuitivo
                      </span>
                    </div>
                    <div className="w-14 h-14 bg-white/40 backdrop-blur rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              ✨ Por que escolher o ESOrbit
            </span>
            <h2 className="text-5xl font-extrabold text-gray-900 mt-6 mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para gerenciar seu e-commerce de forma
              profissional e escalável
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-600 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <svg
                  className="w-9 h-9 text-blue-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Segurança Avançada
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Autenticação JWT com refresh tokens, cookies HttpOnly e proteção
                de rotas para máxima segurança dos seus dados.
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-indigo-600 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <svg
                  className="w-9 h-9 text-indigo-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Catálogo Flexível
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gerencie produtos, bundles e cosméticos com sistema de
                precificação dinâmica e controle de disponibilidade.
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-purple-600 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <svg
                  className="w-9 h-9 text-purple-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Arquitetura Limpa
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Código organizado seguindo princípios SOLID e Clean Architecture
                para manutenção e escalabilidade facilitadas.
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-green-600 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <svg
                  className="w-9 h-9 text-green-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Controle Financeiro
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sistema completo de ledger financeiro para rastreamento
                detalhado de todas as transações e movimentações.
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-yellow-600 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors">
                <svg
                  className="w-9 h-9 text-yellow-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Performance Otimizada
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Construído com Next.js 16, React 19 e Tailwind CSS 4 para
                carregamento ultrarrápido e experiência fluida.
              </p>
            </div>

            <div className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-red-600 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <svg
                  className="w-9 h-9 text-red-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                API RESTful Completa
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Backend robusto desenvolvido com NestJS e Prisma para integração
                fácil, documentada e escalável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Preview Section */}
      <section
        id="catalog"
        className="py-24 bg-linear-to-br from-gray-50 to-blue-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              🎮 Catálogo
            </span>
            <h2 className="text-5xl font-extrabold text-gray-900 mt-6 mb-4">
              Catálogo de Produtos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore nossos produtos e cosméticos exclusivos com sistema de
              precificação dinâmica e controle de estoque em tempo real
            </p>
            <Link href="/catalog">
              <Button
                type="primary"
                size="large"
                className="h-16 px-12 text-lg font-bold min-w-[280px]"
              >
                Ver Catálogo Completo →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Skins Premium",
                desc: "Centenas de skins exclusivas com precificação especial",
                gradient: "from-purple-400 to-pink-500",
              },
              {
                title: "Emotes & Danças",
                desc: "Expresse-se com os melhores emotes do jogo",
                gradient: "from-blue-400 to-cyan-500",
              },
              {
                title: "Bundles Especiais",
                desc: "Pacotes completos com preços promocionais",
                gradient: "from-orange-400 to-red-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div
                  className={`h-56 bg-linear-to-br ${item.gradient} flex items-center justify-center`}
                >
                  <span className="text-6xl">🎮</span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      V-Bucks
                    </span>
                    <Link href="/catalog">
                      <Button className="font-semibold">Ver mais</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Crie sua conta agora e tenha acesso a todos os recursos da
            plataforma de forma gratuita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="large"
                className="h-20 px-14 text-xl font-bold bg-white text-blue-600 hover:bg-gray-100! hover:text-blue-600! min-w-[300px]"
              >
                Criar conta gratuitamente
              </Button>
            </Link>
            <Link href="/catalog">
              <Button
                size="large"
                ghost
                className="h-20 px-14 text-xl font-bold text-white border-white hover:bg-white/20! hover:text-white! hover:border-white! min-w-[300px]"
              >
                Explorar catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">ES</span>
                </div>
                <span className="text-2xl font-bold text-white">ESOrbit</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Plataforma de e-commerce moderna com arquitetura limpa,
                segurança avançada e performance otimizada.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Produto</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Recursos
                  </a>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Preços
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Documentação
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Empresa</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Carreiras
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Termos de uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Licença
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 ESOrbit. Todos os direitos reservados.
              </p>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">
                Feito com ❤️ por davicamposdev
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
