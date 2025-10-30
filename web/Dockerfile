# Stage base - usada em todos os ambientes
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instala as dependências
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Dependências de desenvolvimento para compilação
FROM base AS deps-dev
COPY package*.json ./
RUN npm ci

# Build para produção
FROM base AS builder
COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

# Argumentos de build para variáveis de ambiente em tempo de compilação
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Ambiente de desenvolvimento
FROM base AS development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci
COPY . .

# Cria usuário sem privilégios de root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Ambiente de produção
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cria usuário sem privilégios de root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copia apenas os arquivos necessários do builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Se você estiver usando sharp para otimização de imagens
RUN npm install sharp

USER nextjs

EXPOSE 3000

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error()})"

CMD ["node", "server.js"]