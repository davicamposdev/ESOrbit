# Stage base - usada em todos os ambientes
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Instala as dependências
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# Build para produção
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
COPY prisma ./prisma/
RUN npx prisma generate
RUN npm run build

# Ambiente de desenvolvimento
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate

# Cria usuário sem privilégios de root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Ferramentas de desenvolvimento
RUN npm install -g @nestjs/cli

USER nestjs

EXPOSE 4000 9229

CMD ["npm", "run", "start:dev"]

# Ambiente de produção
FROM base AS production
ENV NODE_ENV=production

# Cria usuário sem privilégios de root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copia as dependências de produção
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --chown=nestjs:nodejs package*.json ./

# Cria os diretórios necessários
RUN mkdir -p /app/logs && \
    chown -R nestjs:nodejs /app/logs

USER nestjs

EXPOSE 4000

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error()})"

# Roda as migrations e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]