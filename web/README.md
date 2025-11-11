# ESOrbit - Frontend

Frontend do sistema ESOrbit construído com Next.js 16 e TypeScript seguindo o padrão **Feature-Sliced Design**.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **JWT** - Autenticação com tokens

## 📁 Estrutura do Projeto

```
web/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de registro
│   │   └── layout.tsx     # Layout para páginas auth
│   ├── api/               # API routes
│   │   └── health/        # Health check
│   ├── dashboard/         # Dashboard (protegido)
│   ├── layout.tsx         # Layout raiz com AuthProvider
│   └── page.tsx           # Página inicial
│
├── features/              # Features da aplicação (módulos)
│   ├── auth/              # Feature de autenticação
│   │   ├── components/    # Componentes específicos de auth
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── index.ts   # Barrel export
│   │   ├── hooks/         # Hooks específicos de auth
│   │   │   ├── use-auth.tsx
│   │   │   └── index.ts   # Barrel export
│   │   ├── services/      # Serviços de API de auth
│   │   │   ├── api-client.ts
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts   # Barrel export
│   │   └── index.ts       # Barrel export da feature
│   └── index.ts           # Barrel export de todas features
│
└── shared/                # Código compartilhado entre features
    ├── components/        # Componentes reutilizáveis
    ├── hooks/             # Hooks reutilizáveis
    ├── utils/             # Utilitários
    └── index.ts           # Barrel export
```

## 🎯 Padrão Feature-Sliced Design

Cada feature é um módulo independente e auto-contido:

```
features/
├── auth/              # Feature de autenticação
│   ├── components/    # Componentes UI específicos
│   ├── hooks/         # Hooks e contexts
│   ├── services/      # Lógica de negócio e API
│   └── index.ts       # Exports públicos
```

**Benefícios:**

- ✅ Código organizado por funcionalidade
- ✅ Fácil de escalar e manter
- ✅ Imports limpos com barrel exports
- ✅ Reuso de código via pasta `shared/`
- ✅ Isolamento de responsabilidades

## 🔐 Sistema de Autenticação

### Como Funciona

1. **Login/Registro**: O usuário faz login ou cria uma conta
2. **Tokens JWT**:
   - **Access Token**: Armazenado no localStorage, usado em requisições
   - **Refresh Token**: Armazenado em cookie HttpOnly pela API
3. **Proteção de Rotas**: Context verifica autenticação e redireciona
4. **Renovação Automática**: Tenta renovar tokens automaticamente ao carregar

### Hook de Autenticação

O hook `useAuth` gerencia o estado global de autenticação:

```tsx
import { useAuth } from "@/features/auth";

const { user, loading, login, register, logout, refreshAuth } = useAuth();
```

**API do Hook:**

- `user`: Dados do usuário autenticado ou null
- `loading`: Estado de carregamento
- `login(email, password)`: Faz login
- `register(email, username, password)`: Registra novo usuário
- `logout()`: Faz logout
- `refreshAuth()`: Renova os tokens

### Serviço de API

O `authService` comunica com a API:

```typescript
import { authService } from "@/features/auth";

// Login
const { user, accessToken } = await authService.login({ email, password });

// Registro
const { user, accessToken } = await authService.register({
  email,
  username,
  password,
});

// Renovar token
const { accessToken } = await authService.refresh();

// Obter usuário atual
const { user } = await authService.me();

// Logout
await authService.logout();
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

## 📝 Guia de Desenvolvimento

### 1. Criar uma Nova Página Protegida

```tsx
"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MinhaRota() {
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

### 2. Criar Nova Feature

```bash
# Estrutura de uma nova feature
features/
└── minha-feature/
    ├── components/       # Componentes React
    │   ├── component-1.tsx
    │   └── index.ts
    ├── hooks/            # Hooks customizados
    │   ├── use-minha-feature.tsx
    │   └── index.ts
    ├── services/         # Lógica de negócio e API
    │   ├── minha-feature.service.ts
    │   └── index.ts
    └── index.ts          # Barrel export
```

**Exemplo de serviço:**

```typescript
// features/minha-feature/services/minha-feature.service.ts
import { apiClient } from "@/features/auth/services";

export class MinhaFeatureService {
  async buscarDados() {
    return apiClient.get("/meu-endpoint");
  }

  async enviarDados(data: any) {
    return apiClient.post("/meu-endpoint", data);
  }
}

export const minhaFeatureService = new MinhaFeatureService();
```

### 3. Fazer Requisições Autenticadas

```typescript
import { apiClient } from "@/features/auth";

// O token é adicionado automaticamente
const data = await apiClient.get("/algum-endpoint");
```

### 4. Importar de Features

Graças aos barrel exports, as importações são limpas:

```typescript
// ✅ Bom - Importa direto da feature
import { useAuth, LoginForm, authService } from "@/features/auth";

// ❌ Evite - Importações específicas de caminho
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LoginForm } from "@/features/auth/components/login-form";
```

### 5. Compartilhar Código Entre Features

Use a pasta `shared/` para código reutilizável:

```typescript
// shared/components/button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// shared/index.ts
export * from "./components/button";

// Usar em qualquer feature
import { Button } from "@/shared";
```

## 🎨 Estilização

O projeto usa Tailwind CSS 4. Classes principais:

- **Cores**: `bg-blue-600`, `text-gray-900`, etc.
- **Dark Mode**: Prefixo `dark:`, ex: `dark:bg-gray-800`
- **Layout**: `flex`, `grid`, `space-y-4`
- **Responsivo**: Prefixos `sm:`, `md:`, `lg:`

## 🔒 Segurança

- ✅ Refresh tokens em cookies HttpOnly (gerenciado pela API)
- ✅ Access tokens com duração curta (15 min)
- ✅ Renovação automática de tokens
- ✅ Proteção contra XSS (cookies httpOnly)
- ✅ Proteção CSRF (sameSite: 'lax')
- ✅ HTTPS em produção (configurar `secure: true`)

## 🐛 Troubleshooting

### Token expirando muito rápido

O access token expira em 15 minutos. O sistema tenta renovar automaticamente usando o refresh token.

### CORS errors

Certifique-se de que a API está configurada para aceitar requisições do frontend:

```typescript
// Na API (main.ts)
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true, // IMPORTANTE!
});
```

### Cookies não sendo enviados

Certifique-se de usar `credentials: 'include'` nas requisições (já configurado no `apiClient`).

## 📚 Documentação Adicional

- [GETTING_STARTED.md](./GETTING_STARTED.md) - Guia de início rápido
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Resumo técnico
- [CHECKLIST.md](./CHECKLIST.md) - Checklist de testes
- [docs/AUTHENTICATION_GUIDE.md](./docs/AUTHENTICATION_GUIDE.md) - Guia detalhado

## 📖 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [JWT.io](https://jwt.io/)

---

**Desenvolvido com ❤️ usando Next.js 16, TypeScript e Tailwind CSS**
