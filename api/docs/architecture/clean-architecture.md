# 🏗️ Clean Architecture

## Visão Geral

O projeto segue **Clean Architecture** com separação clara em 4 camadas:

```
┌─────────────────────────────────────┐
│  PRESENTATION (Apresentação)        │  ← Controllers, DTOs, Guards
│  ↓ depende                          │
├─────────────────────────────────────┤
│  APPLICATION (Aplicação)            │  ← Use Cases
│  ↓ depende                          │
├─────────────────────────────────────┤
│  DOMAIN (Domínio)                   │  ← Entities, Interfaces
│  ↑ implementa                       │
├─────────────────────────────────────┤
│  INFRASTRUCTURE (Infraestrutura)    │  ← Repositories, Services
└─────────────────────────────────────┘
```

---

## Estrutura de Pastas

```
src/modules/auth/
├── domain/              # 🔵 Regras de negócio puras
│   ├── entities/
│   ├── interfaces/
│   ├── repositories/
│   └── services/
│
├── application/         # 🟢 Casos de uso
│   └── use-cases/
│
├── infrastructure/      # 🟡 Implementações técnicas
│   ├── repositories/
│   └── services/
│
├── presentation/        # 🟠 Interface HTTP
│   ├── controllers/
│   ├── dtos/
│   ├── guards/
│   ├── strategies/
│   └── decorators/
│
└── auth.module.ts
```

---

## Regra de Ouro

**Dependências sempre apontam para dentro (Domain)**

- ✅ Application depende de Domain
- ✅ Infrastructure implementa Domain
- ✅ Presentation usa Application
- ❌ Domain NUNCA depende de outras camadas

---

## Benefícios

### 🧪 Testabilidade

- Use cases testáveis sem banco de dados
- Fácil mockar interfaces

### 🔄 Manutenibilidade

- Mudanças isoladas por camada
- Responsabilidades claras

### 📈 Escalabilidade

- Fácil adicionar novos módulos
- Padrão consistente

### 🔌 Flexibilidade

- Trocar Prisma por TypeORM sem afetar use cases
- Adicionar GraphQL sem modificar application
