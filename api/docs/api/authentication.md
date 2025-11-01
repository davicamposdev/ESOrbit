# 🔐 Autenticação

## Estratégia

O sistema usa **JWT com Refresh Tokens**:

- **Access Token:** Curta duração (15 min), enviado no header
- **Refresh Token:** Longa duração (7 dias), HttpOnly cookie

---

## Fluxo de Autenticação

### 1. Registro/Login

```
Cliente → POST /auth/register ou /auth/login
      ← Access Token (JSON)
      ← Refresh Token (Cookie HttpOnly)
```

### 2. Requisição Protegida

```
Cliente → GET /auth/me
        → Header: Authorization: Bearer <access_token>
      ← Dados do usuário
```

### 3. Renovar Tokens

```
Cliente → POST /auth/refresh
        → Cookie: refresh_token (automático)
      ← Novo Access Token
      ← Novo Refresh Token (cookie atualizado)
```

### 4. Logout

```
Cliente → POST /auth/logout
      ← Cookie removido
```

---

## Segurança

### Hash de Senhas

- **Argon2** (mais seguro que bcrypt)
- Resistente a ataques GPU

### Tokens JWT

- Algoritmo **HS256**
- JTI único por par de tokens
- Assinatura verificada

### Cookies

- `httpOnly: true` → Proteção XSS
- `sameSite: 'lax'` → Proteção CSRF
- `secure: false` (dev) / `true` (prod)
- `path: '/auth/refresh'` → Escopo limitado

### Guards

- **JwtAuthGuard:** Global, protege todas as rotas
- **@Public():** Decorator para rotas públicas
- **JwtRefreshGuard:** Apenas para refresh

---

## Estrutura do Token

### Access Token

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "jti": "unique-token-id",
  "iat": 1698765432,
  "exp": 1698766332
}
```

### Refresh Token

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "jti": "unique-token-id",
  "iat": 1698765432,
  "exp": 1699370232
}
```
