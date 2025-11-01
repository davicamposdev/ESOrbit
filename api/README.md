# 🚀 ESOrbit API

Sistema de autenticação JWT com **Clean Architecture** e princípios **SOLID**.

---

## 📖 Documentação

- **[📚 Documentação Completa](./docs/README.md)** - Índice principal
- **[⚡ Início Rápido](./docs/guides/quick-start.md)** - Como começar
- **[🏗️ Arquitetura](./docs/architecture/clean-architecture.md)** - Clean Architecture
- **[📡 API](./docs/api/endpoints.md)** - Endpoints disponíveis
- **[🧪 Testes](./test/README.md)** - Guia de testes

---

## ⚡ Início Rápido

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Iniciar em desenvolvimento
npm run start:dev
```

**API:** `http://localhost:4000/api`

---

## 🎯 Principais Recursos

- ✅ **Autenticação JWT** (Access + Refresh tokens)
- ✅ **Clean Architecture** (4 camadas)
- ✅ **Princípios SOLID**
- ✅ **Hash Argon2** (mais seguro que bcrypt)
- ✅ **Guards Globais** com decorator @Public()
- ✅ **Validação DTOs** com class-validator
- ✅ **TypeScript Strict**
- ✅ **Prisma ORM**

---

## 📁 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/
│   │   ├── domain/           # Entidades e interfaces
│   │   ├── application/      # Casos de uso
│   │   ├── infrastructure/   # Implementações (Prisma, JWT, Argon2)
│   │   └── presentation/     # Controllers, DTOs, Guards
│   └── users/
│       └── (mesma estrutura)
└── common/
    └── database/             # Prisma global

docs/                         # 📚 Documentação
test/                         # 🧪 Testes
```

---

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:cov

# Script bash (requer jq)
./test/scripts/test-auth.sh
```

Ver [guia completo de testes](./test/README.md).

---

## 🛠️ Stack Tecnológica

- **[NestJS](https://nestjs.com/)** - Framework Node.js
- **[Prisma](https://www.prisma.io/)** - ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados
- **[JWT](https://jwt.io/)** - Autenticação
- **[Argon2](https://github.com/ranisalt/node-argon2)** - Hash de senhas
- **[Passport](https://www.passportjs.org/)** - Estratégias de autenticação

---

## 📝 Scripts Disponíveis

```bash
npm run start          # Produção
npm run start:dev      # Desenvolvimento (watch)
npm run build          # Build
npm run lint           # Lint
npm run format         # Format
npm test               # Testes unitários
npm run test:e2e       # Testes E2E
npm run test:cov       # Cobertura
```

---

## 🔗 Links Úteis

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Princípios SOLID](https://en.wikipedia.org/wiki/SOLID)

---

## 📄 Licença

MIT

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
