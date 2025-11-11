# Como Usar o Sistema de Autenticação

## 📖 Guia Rápido

### 1. Iniciar a Aplicação

```bash
# No diretório web/
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3001`

### 2. Fluxo Básico

1. **Página Inicial** (`/`): Apresenta opções de Login e Registro
2. **Registro** (`/register`): Crie uma nova conta
3. **Login** (`/login`): Entre com sua conta
4. **Dashboard** (`/dashboard`): Área autenticada (redirecionada após login)

---

## 🔐 Exemplos de Uso

### Usar o Hook de Autenticação

```tsx
"use client";

import { useAuth } from "@/features/auth";

export default function MeuComponente() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <h1>Olá, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Fazer Login Programaticamente

```tsx
"use client";

import { useAuth } from "@/features/auth";

export default function LoginExample() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login("usuario@email.com", "senha123");
      // Usuário logado com sucesso
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Criar Página Protegida

```tsx
"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaginaProtegida() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redireciona para login se não autenticado
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Mostra loading
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Não renderiza nada enquanto redireciona
  if (!user) {
    return null;
  }

  // Renderiza conteúdo protegido
  return (
    <div>
      <h1>Conteúdo Protegido</h1>
      <p>Só usuários autenticados veem isto!</p>
    </div>
  );
}
```

### Fazer Requisições Autenticadas

```tsx
import { apiClient, authService } from "@/features/auth";

// O token é automaticamente incluído nas requisições

// GET
const dados = await apiClient.get("/algum-endpoint");

// POST
const resultado = await apiClient.post("/algum-endpoint", {
  campo: "valor",
});

// PUT
await apiClient.put("/algum-endpoint/123", {
  campo: "novo valor",
});

// DELETE
await apiClient.delete("/algum-endpoint/123");
```

### Criar Novo Serviço de API

```typescript
// features/produtos/services/produtos.service.ts
import { apiClient } from "@/features/auth/services";

export interface Produto {
  id: string;
  nome: string;
  preco: number;
}

export class ProdutosService {
  async listar(): Promise<Produto[]> {
    return apiClient.get<Produto[]>("/produtos");
  }

  async buscar(id: string): Promise<Produto> {
    return apiClient.get<Produto>(`/produtos/${id}`);
  }

  async criar(produto: Omit<Produto, "id">): Promise<Produto> {
    return apiClient.post<Produto>("/produtos", produto);
  }

  async atualizar(id: string, produto: Partial<Produto>): Promise<Produto> {
    return apiClient.put<Produto>(`/produtos/${id}`, produto);
  }

  async deletar(id: string): Promise<void> {
    return apiClient.delete<void>(`/produtos/${id}`);
  }
}

export const produtosService = new ProdutosService();
```

### Usar Serviço Personalizado

```tsx
"use client";

import { useState, useEffect } from "react";
import { produtosService } from "@/features/produtos";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await produtosService.listar();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {produtos.map((produto) => (
        <div key={produto.id}>
          <h3>{produto.nome}</h3>
          <p>R$ {produto.preco}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Componentes Customizados

### Botão de Logout

```tsx
"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Sair
    </button>
  );
}
```

### Guard de Autenticação (HOC)

```tsx
// shared/components/auth-guard.tsx
"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback || <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

// Uso:
export default function MinhaRota() {
  return (
    <AuthGuard fallback={<div>Verificando autenticação...</div>}>
      <div>Conteúdo protegido</div>
    </AuthGuard>
  );
}
```

### Mostrar Info do Usuário

```tsx
"use client";

import { useAuth } from "@/features/auth";

export function UserInfo() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {user.username[0].toUpperCase()}
      </div>
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}
```

---

## 🔧 Configurações Avançadas

### Interceptar Requisições

Edite `features/auth/services/api-client.ts` para adicionar interceptors:

```typescript
async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${this.baseUrl}${endpoint}`;

  // Log de requisições (desenvolvimento)
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  const config: RequestInit = {
    ...options,
    headers: {
      ...this.getHeaders(),
      ...options.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    // Log de respostas
    console.log(`[API] Response ${response.status} from ${url}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'Erro na requisição');
    }

    return await response.json();
  } catch (error) {
    console.error(`[API] Error in ${url}:`, error);
    throw error;
  }
}
```

### Renovação Automática de Token

O sistema já tenta renovar automaticamente. Para forçar renovação:

```tsx
import { useAuth } from "@/features/auth";

function MeuComponente() {
  const { refreshAuth } = useAuth();

  const forcarRenovacao = async () => {
    try {
      await refreshAuth();
      console.log("Token renovado com sucesso!");
    } catch (error) {
      console.error("Erro ao renovar token:", error);
    }
  };

  return <button onClick={forcarRenovacao}>Renovar Token</button>;
}
```

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Problema**: API não está rodando ou URL incorreta

**Solução**:

1. Verifique se a API está rodando em `http://localhost:3000`
2. Confirme a variável `NEXT_PUBLIC_API_URL` no `.env.local`

### Erro: CORS

**Problema**: API bloqueando requisições do frontend

**Solução**: Configure CORS na API:

```typescript
// api/src/main.ts
app.enableCors({
  origin: "http://localhost:3001", // URL do frontend
  credentials: true, // Importante para cookies
});
```

### Usuário deslogado automaticamente

**Problema**: Tokens expirando

**Solução**: O refresh token tem duração de 7 dias. Após isso, o usuário precisa fazer login novamente.

### Cookies não sendo enviados

**Problema**: Configuração de cookies incorreta

**Solução**: Verifique no backend que os cookies estão configurados com:

- `httpOnly: true`
- `sameSite: 'lax'`
- `path: '/auth/refresh'`

---

## 📚 Referências

- [Documentação Next.js](https://nextjs.org/docs)
- [API de Autenticação](../api/docs/api/authentication.md)
- [React Context](https://react.dev/reference/react/useContext)
- [JWT.io](https://jwt.io/)
