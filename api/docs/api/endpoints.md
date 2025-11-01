# 📡 Endpoints da API

Base URL: `http://localhost:4000/api`

---

## 🔓 Rotas Públicas

### POST /auth/register

Registra um novo usuário.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123",
  "displayName": "Nome do Usuário"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nome do Usuário",
    "credits": 10000
  },
  "accessToken": "eyJhbGc..."
}
```

**Cookie:** `refresh_token` (HttpOnly)

---

### POST /auth/login

Autentica um usuário.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nome do Usuário",
    "credits": 10000
  },
  "accessToken": "eyJhbGc..."
}
```

**Cookie:** `refresh_token` (HttpOnly)

---

### POST /auth/refresh

Renova os tokens.

**Cookie:** `refresh_token` (enviado automaticamente)

**Response (200):**

```json
{
  "accessToken": "eyJhbGc..."
}
```

**Cookie:** `refresh_token` (atualizado)

---

### POST /auth/logout

Remove o refresh token.

**Response (200):**

```json
{
  "ok": true
}
```

---

## 🔒 Rotas Protegidas

Requerem header: `Authorization: Bearer <access_token>`

### GET /auth/me

Retorna dados do usuário autenticado.

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nome do Usuário",
    "credits": 10000
  }
}
```

---

### GET /users/:id

Busca usuário por ID.

**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Nome do Usuário",
    "credits": 10000,
    "createdAt": "2025-10-31T00:00:00.000Z",
    "updatedAt": "2025-10-31T00:00:00.000Z"
  }
}
```

---

## ❌ Códigos de Erro

| Código | Descrição                  |
| ------ | -------------------------- |
| 200    | Sucesso                    |
| 201    | Criado                     |
| 400    | Dados inválidos            |
| 401    | Não autorizado             |
| 404    | Não encontrado             |
| 409    | Conflito (email já existe) |
| 500    | Erro interno               |
