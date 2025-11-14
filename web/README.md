# ESOrbit Web

Aplicação frontend para ESOrbit, construída com Next.js 16 e TypeScript seguindo o padrão Feature-Sliced Design.

## Visão Geral

A aplicação web ESOrbit fornece uma interface de usuário intuitiva para navegar cosméticos, gerenciar inventário de usuários e processar transações. A aplicação é construída com padrões modernos de React, apresentando uma arquitetura limpa que separa responsabilidades em módulos de features independentes.

## Arquitetura

Este projeto implementa a metodologia Feature-Sliced Design, organizando o código por features ao invés de camadas técnicas. Cada feature é auto-contida com seus próprios componentes, hooks e serviços, enquanto o código compartilhado vive em um diretório dedicado.

## Principais Funcionalidades

### Experiência do Usuário

- Interface limpa e responsiva para todos os tamanhos de dispositivos
- Navegação persistente com contexto de usuário
- Atualizações de saldo de créditos em tempo real
- Busca e filtragem intuitivas
- Suporte a modo escuro

### Sistema de Autenticação

- Fluxos completos de registro e login
- Autenticação baseada em JWT com renovação automática de tokens
- Tratamento de rotas protegidas
- Persistência de sessão
- Logout seguro

### Navegação de Catálogo

- Navegar cosméticos individuais com informações detalhadas
- Ver pacotes de bundles com itens incluídos
- Filtrar por tipo, raridade, disponibilidade e promoções
- Funcionalidade de busca
- Layouts de cards responsivos

### Dashboard do Usuário

- Visão geral do status da conta
- Acesso rápido a inventário e transações
- Exibição de saldo de créditos
- Feed de atividades recentes

### Gerenciamento de Inventário

- Visualizar cosméticos possuídos
- Filtrar e buscar no inventário
- Rastrear datas de compra
- Ver detalhes dos itens

### Histórico de Transações

- Histórico completo de compras
- Registros de transferências
- Rastreamento de devoluções/reembolsos
- Detalhes e timestamps de transações

## Stack Tecnológica

- **Framework**: Next.js 16 com App Router
- **Biblioteca UI**: React 19
- **Linguagem**: TypeScript 5
- **Componentes UI**: Ant Design 5
- **Estilização**: Tailwind CSS 4
- **Autenticação**: JWT com refresh tokens
- **Gerenciamento de Estado**: React Context API
- **Cliente HTTP**: Fetch API com wrapper customizado

## Como Começar

### Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Instância da API ESOrbit rodando

### Instalação

```bash
# Instalar dependências
npm install

# Copiar configuração de ambiente
cp .env.example .env.local
```

### Configuração

Edite `.env.local` com suas configurações:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=ESOrbit
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Executando a Aplicação

```bash
# Modo desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Executar linter
npm run lint
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
web/
├── app/                       # Next.js App Router
│   ├── (auth)/               # Grupo de rotas de autenticação
│   │   ├── login/            # Página de login
│   │   ├── register/         # Página de registro
│   │   └── layout.tsx        # Layout de auth
│   ├── api/                  # Rotas de API
│   │   └── health/           # Endpoint de health check
│   ├── catalog/              # Páginas do catálogo
│   │   ├── page.tsx          # Listagem de cosméticos
│   │   └── bundles/          # Página de bundles
│   ├── dashboard/            # Página de dashboard
│   ├── inventory/            # Inventário do usuário
│   ├── profile/              # Perfil do usuário
│   ├── transactions/         # Histórico de transações
│   ├── layout.tsx            # Layout raiz com providers
│   └── page.tsx              # Landing page
│
├── features/                  # Módulos de features
│   ├── auth/                 # Feature de autenticação
│   │   ├── components/       # Formulários de Login/Register
│   │   ├── hooks/            # Hook useAuth
│   │   ├── services/         # Serviço de API de auth
│   │   └── index.ts          # Exports públicos
│   ├── catalog/              # Feature de catálogo
│   │   ├── components/       # Cards, filtros
│   │   ├── hooks/            # useCatalog, useBundles
│   │   ├── services/         # Serviço de API de catálogo
│   │   └── index.ts          # Exports públicos
│   ├── finance/              # Feature de finanças
│   │   ├── services/         # Serviços de compra, transferência
│   │   └── index.ts          # Exports públicos
│   ├── dashboard/            # Feature de dashboard
│   ├── inventory/            # Feature de inventário
│   ├── profile/              # Feature de perfil
│   ├── transactions/         # Feature de transações
│   └── index.ts              # Barrel export de features
│
└── shared/                    # Código compartilhado
    ├── components/           # Componentes reutilizáveis (Navbar, etc.)
    ├── layouts/              # Layouts comuns
    ├── hooks/                # Hooks compartilhados
    ├── utils/                # Funções utilitárias
    └── index.ts              # Exports compartilhados
```

## Feature-Sliced Design

Cada feature é um módulo independente com uma estrutura consistente:

```
features/[nome-da-feature]/
├── components/          # Componentes UI específicos desta feature
├── hooks/              # Hooks customizados para esta feature
├── services/           # Chamadas de API e lógica de negócio
└── index.ts            # API pública da feature
```

**Benefícios**:

- Clara separação de responsabilidades
- Fácil de escalar e manter
- Previne dependências circulares
- Promove reusabilidade de código
- Simplifica testes

**Regras**:

- Features não devem importar de outras features diretamente
- Código compartilhado vai no diretório `shared/`
- Cada feature exporta apenas o que é necessário via `index.ts`
- Use barrel exports para imports limpos

## Fluxo de Autenticação

### Como Funciona

1. Usuário submete credenciais via formulário de login ou registro
2. API retorna access token (curta duração) e refresh token (longa duração em cookie HttpOnly)
3. Access token é armazenado no localStorage
4. Todas as requisições à API incluem o access token no header Authorization
5. Quando o access token expira, o refresh token é usado para obter um novo access token
6. Se o refresh falhar, usuário é redirecionado para login

### Usando Autenticação

O hook `useAuth` fornece estado e métodos de autenticação:

```tsx
import { useAuth } from "@/features/auth";

function MeuComponente() {
  const { user, loading, login, logout, register, refreshAuth } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Por favor, faça login</div>;

  return <div>Bem-vindo, {user.username}!</div>;
}
```

### Rotas Protegidas

Para proteger uma página, verifique o status de autenticação:

```tsx
"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaginaProtegida() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div>Carregando...</div>;

  return <div>Conteúdo protegido</div>;
}
```

## Integração com API

### Cliente API

A aplicação usa um cliente API customizado com tratamento automático de tokens:

```typescript
import { apiClient } from "@/features/auth/services";

// Requisição GET
const data = await apiClient.get("/endpoint");

// Requisição POST
const result = await apiClient.post("/endpoint", { data });

// Requisição PUT
await apiClient.put("/endpoint/:id", { data });

// Requisição DELETE
await apiClient.delete("/endpoint/:id");
```

O cliente automaticamente:

- Adiciona token JWT às requisições
- Trata refresh de token em erros 401
- Inclui credentials para auth baseada em cookies
- Faz parse de respostas JSON
- Lança erros para respostas não-2xx

### Criando Novos Serviços

Para adicionar um novo serviço de API:

```typescript
// features/minha-feature/services/minha-feature.service.ts
import { apiClient } from "@/features/auth/services";

export class MinhaFeatureService {
  async obterDados() {
    return apiClient.get("/meu-endpoint");
  }

  async criarItem(data: any) {
    return apiClient.post("/meu-endpoint", data);
  }
}

export const minhaFeatureService = new MinhaFeatureService();
```

## Desenvolvimento de Componentes

### Criando Componentes de Feature

Coloque componentes no diretório da feature:

```tsx
// features/catalog/components/cosmetic-card.tsx
interface CosmeticCardProps {
  cosmetic: Cosmetic;
  onPurchase?: (id: string) => void;
}

export function CosmeticCard({ cosmetic, onPurchase }: CosmeticCardProps) {
  return (
    <div>
      <h3>{cosmetic.name}</h3>
      <p>{cosmetic.type}</p>
      {onPurchase && (
        <button onClick={() => onPurchase(cosmetic.id)}>Comprar</button>
      )}
    </div>
  );
}
```

Exporte do index da feature:

```typescript
// features/catalog/index.ts
export * from "./components/cosmetic-card";
export * from "./hooks/use-catalog";
export * from "./services/catalog.service";
```

### Componentes Compartilhados

Coloque componentes reutilizáveis em `shared/components/`:

```tsx
// shared/components/button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

## Estilização

O projeto usa Tailwind CSS 4 para estilização. Padrões comuns:

### Layout

```tsx
<div className="flex items-center justify-between">
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Conteúdo */}
    </div>
  </div>
</div>
```

### Cores

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <span className="text-blue-600">Primário</span>
  <span className="text-green-600">Sucesso</span>
  <span className="text-red-600">Perigo</span>
</div>
```

### Design Responsivo

```tsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  <div className="hidden md:block">Apenas desktop</div>
  <div className="md:hidden">Apenas mobile</div>
</div>
```

## Gerenciamento de Estado

A aplicação usa React Context para estado global:

### Context de Auth

Gerencia estado de autenticação do usuário:

```tsx
import { useAuth } from "@/features/auth";

const { user, loading, login, logout } = useAuth();
```

### Criando Novos Contexts

Para estado específico de feature:

```tsx
// features/catalog/hooks/use-catalog.tsx
import { createContext, useContext, useState } from "react";

interface CatalogContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>({});

  return (
    <CatalogContext.Provider value={{ filters, setFilters }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context)
    throw new Error("useCatalog deve ser usado dentro de CatalogProvider");
  return context;
}
```

## Formulários e Validação

Use componentes de formulário do Ant Design com validação integrada:

```tsx
import { Form, Input, Button } from "antd";

export function LoginForm() {
  const [form] = Form.useForm();
  const { login } = useAuth();

  const handleSubmit = async (values: any) => {
    await login(values.email, values.password);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email é obrigatório" },
          { type: "email", message: "Email inválido" },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Senha é obrigatória" }]}
      >
        <Input.Password placeholder="Senha" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## Boas Práticas

### Organização de Código

- Mantenha componentes pequenos e focados
- Extraia lógica reutilizável em hooks customizados
- Use TypeScript para type safety
- Siga os princípios do feature-sliced design
- Use barrel exports para imports limpos

### Performance

- Use diretiva `'use client'` apenas quando necessário
- Implemente paginação para listas grandes
- Otimize imagens com componente Image do Next.js
- Minimize tamanho do bundle com imports apropriados
- Use React.memo para componentes custosos

### Segurança

- Nunca armazene dados sensíveis no localStorage
- Valide todas as entradas de usuário
- Sanitize dados antes de renderizar
- Use HTTPS em produção
- Mantenha dependências atualizadas

### Acessibilidade

- Use elementos HTML semânticos
- Forneça texto alt para imagens
- Garanta que navegação por teclado funciona
- Use labels ARIA quando necessário
- Teste com leitores de tela

## Testes

Embora testes abrangentes ainda não estejam implementados, a estrutura do projeto suporta testes:

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

Exemplo de estrutura de teste:

```typescript
// features/auth/hooks/use-auth.test.tsx
import { renderHook } from "@testing-library/react";
import { useAuth } from "./use-auth";

describe("useAuth", () => {
  it("deve inicializar com usuário null", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
});
```

## Resolução de Problemas

### Problemas Comuns

**Erros de CORS**:

- Certifique-se de que a API tem configuração CORS apropriada
- Verifique se `NEXT_PUBLIC_API_URL` está correto
- Confira se a API aceita credentials

**Autenticação não persistindo**:

- Verifique se cookies estão sendo enviados (`credentials: 'include'`)
- Certifique-se de que refresh token está sendo armazenado em cookie HttpOnly
- Garanta que API e frontend estão em domínios compatíveis

**Componentes não atualizando**:

- Verifique se o gerenciamento de estado está funcionando
- Confira se context providers estão envolvendo apropriadamente
- Certifique-se de que dependências do useEffect estão corretas

**Erros de build**:

- Limpe diretório `.next`: `rm -rf .next`
- Delete node_modules e reinstale: `rm -rf node_modules && npm install`
- Verifique erros do TypeScript: `npm run type-check`

**Estilização não funcionando**:

- Verifique se Tailwind está configurado apropriadamente
- Confira se CSS está importado no layout
- Limpe cache do navegador e reconstrua

## Deploy

Para deploy em produção:

1. Defina variáveis de ambiente apropriadas para produção
2. Construa a aplicação: `npm run build`
3. Inicie o servidor de produção: `npm start`
4. Configure reverse proxy (nginx, Apache)
5. Configure certificados SSL/TLS
6. Configure CDN para assets estáticos
7. Habilite headers de cache
8. Monitore performance e erros

## Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Ant Design](https://ant.design/docs/react/introduce)
- [Feature-Sliced Design](https://feature-sliced.design)

## Licença

Este projeto está licenciado sob a Licença MIT.
