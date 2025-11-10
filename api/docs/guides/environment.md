# ⚙️ Variáveis de Ambiente

## Configuração Obrigatória

### Database

```env
DATABASE_URL="postgresql://user:password@localhost:5432/esorbit?schema=public"
```

### JWT

```env
JWT_ACCESS_SECRET="secret-forte-256-bits"
JWT_REFRESH_SECRET="secret-forte-256-bits"
JWT_ACCESS_TTL="15m"
JWT_REFRESH_TTL="7d"
```

### Aplicação

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Integração com API Externa

```env
FORTNITE_API_BASE="https://fortnite-api.com/v2"
TIMEOUT_MS=10000
RETRY_ATTEMPTS=3
RETRY_BACKOFF_MS=1000
RATE_LIMIT_RPS=5
```

### Sincronização do Catálogo

```env
# Habilita sincronização automática ao iniciar a aplicação
SYNC_ON_BOOTSTRAP=false
```

**Nota:** Defina como `true` apenas se desejar que o catálogo seja sincronizado automaticamente quando a aplicação iniciar. Útil para ambientes de desenvolvimento ou após deploy em produção para garantir que os dados estejam atualizados.

---

## Gerar Secrets Fortes

```bash
# Linux/Mac
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Ambiente de Produção

```env
NODE_ENV=production
JWT_ACCESS_SECRET="<secret-forte-gerado>"
JWT_REFRESH_SECRET="<secret-forte-gerado>"
FRONTEND_URL="https://seu-dominio.com"
```

**Importante:** Em produção, configure `secure: true` nos cookies (HTTPS).
