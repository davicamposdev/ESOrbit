# 🚀 Guia de Início Rápido

## Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

---

## Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` e configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/esorbit"

# JWT
JWT_ACCESS_SECRET="seu-secret-forte-aqui"
JWT_REFRESH_SECRET="outro-secret-forte-aqui"
```

### 3. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev
```

### 4. Iniciar Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

---

## Verificar Instalação

### Testar API

```bash
curl http://localhost:4000/api/auth/login
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

---

## Próximos Passos

1. Ler [Endpoints da API](../api/endpoints.md)
2. Entender [Clean Architecture](../architecture/clean-architecture.md)
3. Ver [Exemplos de Uso](../api/examples.md)
