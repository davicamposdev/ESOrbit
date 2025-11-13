# 🔄 Melhorias na Lógica de Refresh Token

## Problemas Resolvidos

### 1. **Condição de Refresh Incorreta**

**Antes:** A condição `!endpoint.includes("/auth/")` bloqueava o refresh para **todos** os endpoints de autenticação, incluindo `/auth/me`.

**Depois:** Implementado método `shouldAttemptRefresh()` que especifica exatamente quais endpoints não devem tentar refresh:

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/refresh`
- `/api/auth/logout`

Agora `/auth/me` e outras rotas protegidas podem se beneficiar do refresh automático.

### 2. **Race Condition em Múltiplas Requisições**

**Antes:** Se várias requisições falhassem simultaneamente com 401, múltiplas tentativas de refresh eram iniciadas em paralelo.

**Depois:**

- Implementada `refreshPromise` compartilhada
- Primeira requisição inicia o refresh e armazena a promise
- Requisições subsequentes aguardam a mesma promise
- Todos os subscribers são notificados quando o refresh completa

### 3. **Subscribers Sem Tratamento de Erro**

**Antes:** Se o refresh falhar, os subscribers ficavam esperando indefinidamente.

**Depois:**

- Tipo dos subscribers alterado para aceitar `string | null`
- Subscribers são notificados tanto em caso de sucesso (com o novo token) quanto em falha (com `null`)
- Cada subscriber trata adequadamente ambos os cenários

### 4. **Limpeza de Estado Melhorada**

**Antes:** Estado de refresh não era limpo adequadamente.

**Depois:**

- Uso de `.finally()` garante limpeza do estado sempre
- `isRefreshing` e `refreshPromise` resetados corretamente
- Subscribers limpos após notificação

## Fluxo Atualizado

### Cenário 1: Primeira Requisição com Token Expirado

```
1. Requisição falha com 401
2. shouldAttemptRefresh() valida se deve tentar refresh
3. Inicia refresh e cria refreshPromise
4. Aguarda refresh
5. Se sucesso: atualiza token e retenta requisição
6. Se falha: limpa dados e retorna erro
```

### Cenário 2: Múltiplas Requisições Simultâneas

```
1. Primeira requisição inicia refresh (cria refreshPromise)
2. Segunda requisição detecta isRefreshing = true
3. Segunda requisição se inscreve como subscriber
4. Primeira requisição completa refresh
5. Todos os subscribers são notificados com o resultado
6. Cada subscriber retenta sua requisição original
```

### Cenário 3: Refresh Falha

```
1. Refresh retorna erro
2. Token e localStorage são limpos
3. Subscribers são notificados com null
4. Cada subscriber rejeita sua promise com erro apropriado
5. Frontend pode redirecionar para login
```

## Código do Interceptor

```typescript
async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // ... configuração inicial

  if (!response.ok) {
    if (response.status === 401 && this.shouldAttemptRefresh(endpoint)) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;

        this.refreshPromise = this.refreshToken()
          .then((newToken) => {
            // Sucesso: atualiza token
            this.setAccessToken(newToken);
            localStorage.setItem("accessToken", newToken);
            this.onRefreshed(newToken);
            return newToken;
          })
          .catch((error) => {
            // Falha: limpa dados
            this.setAccessToken(null);
            localStorage.removeItem("accessToken");
            this.onRefreshed(null);
            throw error;
          })
          .finally(() => {
            // Sempre limpa estado
            this.isRefreshing = false;
            this.refreshPromise = null;
          });

        await this.refreshPromise;
        return this.request<T>(endpoint, options);
      } else {
        // Aguarda refresh em andamento
        return new Promise<T>((resolve, reject) => {
          this.addRefreshSubscriber((token: string | null) => {
            if (token) {
              this.request<T>(endpoint, options).then(resolve).catch(reject);
            } else {
              reject(new Error("Sessão expirada. Faça login novamente."));
            }
          });
        });
      }
    }
  }
}
```

## Hook useAuth Simplificado

O hook também foi simplificado, removendo a lógica duplicada de refresh:

**Antes:**

```typescript
try {
  const { user } = await authService.me();
  setUser(user);
} catch (error) {
  try {
    await refreshAuth(); // Duplicação!
  } catch (refreshError) {
    // ...
  }
}
```

**Depois:**

```typescript
try {
  // O interceptor faz o refresh automaticamente
  const { user } = await authService.me();
  setUser(user);
} catch (error) {
  // Se chegou aqui, refresh falhou - apenas limpar
  authService.setAccessToken(null);
  setUser(null);
  localStorage.removeItem("accessToken");
}
```

## Benefícios

✅ **Zero race conditions** - Uma única promise de refresh compartilhada
✅ **Melhor UX** - Requisições simultâneas aguardam o mesmo refresh
✅ **Tratamento de erro robusto** - Subscribers notificados em todos os cenários
✅ **Menos código duplicado** - Lógica centralizada no interceptor
✅ **Previsibilidade** - Lista explícita de endpoints que não fazem refresh
✅ **Performance** - Evita múltiplas chamadas de refresh desnecessárias

## Testando

Para testar o refresh automático:

1. Faça login no sistema
2. Aguarde o access token expirar (15 minutos)
3. Faça qualquer requisição protegida
4. O sistema deve renovar o token automaticamente
5. A requisição original deve ser completada com sucesso

Para testar múltiplas requisições:

1. Expire manualmente o token no localStorage
2. Dispare várias requisições simultaneamente
3. Apenas um refresh deve ocorrer
4. Todas as requisições devem ser completadas

Para testar falha de refresh:

1. Remova o cookie de refresh_token
2. Tente fazer uma requisição
3. Sistema deve limpar dados e mostrar erro de sessão expirada
