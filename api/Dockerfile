FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

COPY --chown=nestjs:nodejs prisma ./prisma
COPY --chown=nestjs:nodejs package*.json ./

USER nestjs

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]