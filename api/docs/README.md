# 📚 Documentação ESOrbit API

Sistema de autenticação JWT com arquitetura limpa e princípios SOLID.

## 📖 Índice

### 🚀 Início Rápido

- [Instalação e Setup](./guides/quick-start.md)
- [Variáveis de Ambiente](./guides/environment.md)

### 🏗️ Arquitetura

- [Clean Architecture](./architecture/clean-architecture.md)
- [Camadas e Responsabilidades](./architecture/layers.md)
- [Princípios SOLID](./architecture/solid-principles.md)

### 📡 API

- [Autenticação](./api/authentication.md)
- [Endpoints](./api/endpoints.md)
- [Exemplos de Uso](./api/examples.md)

### 🔧 Guias

- [Testes](./guides/testing.md)
- [Adicionar Funcionalidades](./guides/adding-features.md)

---

## ⚡ Início Rápido

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run start:dev
```

API disponível em: `http://localhost:4000/api`

---

## 🎯 Principais Recursos

- ✅ Autenticação JWT (Access + Refresh tokens)
- ✅ Clean Architecture
- ✅ Princípios SOLID
- ✅ Hash seguro com Argon2
- ✅ Guards globais
- ✅ Validação de DTOs
- ✅ TypeScript strict

---

## 📁 Estrutura do Projeto

```
src/modules/
├── auth/
│   ├── domain/           # Entidades e interfaces
│   ├── application/      # Casos de uso
│   ├── infrastructure/   # Implementações (Prisma, JWT, Argon2)
│   └── presentation/     # Controllers, DTOs, Guards
└── users/
    └── (mesma estrutura)
```

---

## 🔗 Links Úteis

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
