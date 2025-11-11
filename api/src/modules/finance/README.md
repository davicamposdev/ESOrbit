# Módulo Finance

O módulo Finance é responsável por gerenciar todas as operações financeiras do sistema ESOrbit, incluindo compras de cosméticos, devoluções, transferências de créditos e registro de transações.

## Arquitetura

Este módulo segue os princípios de **Clean Architecture** e **SOLID**, com separação clara de responsabilidades em camadas:

```
finance/
├── domain/              # Regras de negócio e entidades
│   ├── entities/       # Entidades de domínio
│   ├── enums/          # Enumerações do domínio
│   └── repositories/   # Interfaces de repositórios
├── application/        # Casos de uso e lógica de aplicação
│   └── use-cases/     # Implementação de casos de uso
├── infrastructure/     # Detalhes de implementação
│   └── repositories/  # Implementações Prisma dos repositórios
├── presentation/       # Camada de apresentação (API)
│   ├── controllers/   # Controladores REST
│   └── dtos/          # Data Transfer Objects
└── finance.module.ts  # Configuração do módulo NestJS
```

## Funcionalidades

### 1. Compra de Cosméticos

- **Endpoint**: `POST /finance/purchases`
- **Descrição**: Permite que usuários autenticados comprem cosméticos disponíveis
- **Validações**:
  - ✅ **Preço obtido do banco de dados** (segurança crítica - cliente não envia o preço)
  - Verifica se o cosmético tem preço válido definido (currentPrice > 0)
  - Verifica se o usuário tem créditos suficientes
  - Valida se o cosmético está disponível
  - Impede compra duplicada do mesmo cosmético
- **Transação Atômica**: Debita créditos, cria transação e registra compra

### 2. Devolução de Cosméticos

- **Endpoint**: `POST /finance/returns`
- **Descrição**: Permite devolver compras ativas
- **Validações**:
  - Verifica se a compra pertence ao usuário
  - Valida se a compra está no status ACTIVE
- **Transação Atômica**: Credita valor de volta, cria transação de reembolso e marca compra como devolvida

### 3. Transferência de Créditos

- **Endpoint**: `POST /finance/transfers`
- **Descrição**: Permite transferir créditos entre usuários
- **Validações**:
  - Impede transferência para si mesmo
  - Verifica saldo suficiente
  - Valida existência dos usuários
- **Transação Atômica**: Cria duas transações (débito e crédito), atualiza saldos e registra transferência

### 4. Listagem de Compras

- **Endpoint**: `GET /finance/purchases`
- **Descrição**: Lista compras do usuário autenticado
- **Filtros**: status, limit, offset

### 5. Listagem de Transferências

- **Endpoint**: `GET /finance/transfers`
- **Descrição**: Lista transferências do usuário autenticado
- **Filtros**: direction (sent/received/all), status, limit, offset

## Entidades de Domínio

### Transaction

Representa uma transação financeira no sistema.

- **Tipos**: PURCHASE, REFUND, TRANSFER, BONUS, ADJUSTMENT
- **Status**: PENDING, COMPLETED, FAILED
- **Métodos**: `isCompleted()`, `isFailed()`, `markAsCompleted()`, `markAsFailed()`

### Purchase

Representa a compra de um cosmético por um usuário.

- **Status**: ACTIVE, RETURNED, CANCELLED
- **Métodos**: `canBeReturned()`, `markAsReturned()`, `cancel()`, `validate()`

### Return

Representa a devolução de uma compra.

- **Status**: PENDING, COMPLETED, FAILED
- **Métodos**: `markAsCompleted()`, `markAsFailed()`, `validate()`

### Transfer

Representa uma transferência de créditos entre usuários.

- **Status**: PENDING, COMPLETED, FAILED
- **Métodos**: `markAsCompleted()`, `markAsFailed()`, `validate()`

## Repositórios

Todos os repositórios implementam interfaces definidas na camada de domínio e utilizam o PrismaService para acesso ao banco de dados.

- **PrismaTransactionRepository**: Gerencia transações financeiras
- **PrismaPurchaseRepository**: Gerencia compras, com suporte a transações atômicas
- **PrismaReturnRepository**: Gerencia devoluções
- **PrismaTransferRepository**: Gerencia transferências

## Casos de Uso

### PurchaseCosmeticUseCase

Orquestra o processo de compra de um cosmético:

1. Valida se usuário já possui o cosmético
2. Verifica saldo disponível
3. Valida disponibilidade do cosmético
4. Executa transação atômica: cria transação, debita créditos, cria compra

### ReturnCosmeticUseCase

Orquestra o processo de devolução:

1. Busca e valida a compra
2. Verifica se a compra pode ser devolvida
3. Executa transação atômica: cria transação de reembolso, credita valor, atualiza compra, registra devolução

### TransferCreditsUseCase

Orquestra transferência de créditos:

1. Valida remetente e destinatário
2. Verifica saldo disponível
3. Executa transação atômica: cria transações de débito/crédito, atualiza saldos, registra transferência

### ListPurchasesUseCase

Lista compras com filtros e paginação.

### ListTransfersUseCase

Lista transferências com filtros de direção e paginação.

## Segurança

- ✅ **CRÍTICO**: Preços obtidos exclusivamente do banco de dados - cliente não pode manipular valores
- ✅ Todos os endpoints são protegidos com `JwtAuthGuard`
- ✅ Usuário autenticado é obtido via decorator `@CurrentUser()`
- ✅ Validações de propriedade (ex: usuário só pode devolver suas próprias compras)
- ✅ Validações de saldo antes de operações financeiras
- ✅ DTOs validados com class-validator
- ✅ Transações atômicas para consistência de dados

## Transações Atômicas

Todas as operações que modificam múltiplas tabelas utilizam `prisma.$transaction` para garantir consistência:

```typescript
await this.prisma.$transaction(async (tx) => {
  // Múltiplas operações executadas atomicamente
  const transaction = await tx.transaction.create({...});
  await tx.user.update({...});
  const purchase = await tx.purchase.create({...});
  return purchase;
});
```

## Princípios SOLID Aplicados

### Single Responsibility Principle (SRP)

- Cada entidade tem uma única responsabilidade
- Repositórios só cuidam de persistência
- Use cases orquestram regras de negócio
- Controllers apenas mapeiam HTTP para use cases

### Open/Closed Principle (OCP)

- Interfaces de repositórios permitem extensão sem modificação
- Novos tipos de transação podem ser adicionados via enums

### Liskov Substitution Principle (LSP)

- Implementações de repositórios podem ser substituídas
- Injeção de dependência via interfaces

### Interface Segregation Principle (ISP)

- Interfaces específicas para cada repositório
- DTOs separados por operação

### Dependency Inversion Principle (DIP)

- Use cases dependem de abstrações (interfaces)
- Implementações concretas injetadas via DI do NestJS

## Validações com class-validator

Todos os DTOs utilizam decorators do class-validator:

- `@IsUUID()`: Valida IDs
- `@IsNumber()`, `@Min()`: Valida valores numéricos
- `@IsEnum()`: Valida enumerações
- `@IsOptional()`: Campos opcionais
- `@Type()`: Transformação de tipos (query params)

## Exemplos de Uso

### Comprar um cosmético

```bash
POST /finance/purchases
Authorization: Bearer <token>
Content-Type: application/json

{
  "cosmeticId": "123e4567-e89b-12d3-a456-426614174000"
}

# Nota de Segurança:
# O preço é obtido automaticamente do banco de dados (currentPrice do cosmético)
# Isso previne que clientes manipulem o valor e comprem por preços arbitrários
```

### Devolver uma compra

```bash
POST /finance/returns
Authorization: Bearer <token>
Content-Type: application/json

{
  "purchaseId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": "Não gostei do item"
}
```

### Transferir créditos

```bash
POST /finance/transfers
Authorization: Bearer <token>
Content-Type: application/json

{
  "toUserId": "987e6543-e21b-12d3-a456-426614174000",
  "amount": 1000,
  "description": "Pagamento por serviço"
}
```

### Listar compras

```bash
GET /finance/purchases?status=active&limit=20&offset=0
Authorization: Bearer <token>
```

### Listar transferências

```bash
GET /finance/transfers?direction=sent&limit=20&offset=0
Authorization: Bearer <token>
```

## Integração com Outros Módulos

### Auth Module

- Utiliza `JwtAuthGuard` para autenticação
- Utiliza `CurrentUser` decorator para obter usuário autenticado

### Users Module

- Acessa dados de usuário via Prisma
- Atualiza saldo de créditos dos usuários

### Catalog Module

- Valida disponibilidade de cosméticos
- Verifica preços antes de compras

## Melhorias Futuras

1. **Histórico de Transações**: Endpoint para listar todas as transações de um usuário
2. **Estorno Parcial**: Suporte para devoluções parciais de bundles
3. **Limites de Transferência**: Configuração de limites diários/mensais
4. **Notificações**: Integração com sistema de notificações para alertar sobre transações
5. **Auditoria**: Logs detalhados de todas as operações financeiras
6. **Relatórios**: Endpoints para relatórios financeiros agregados
7. **Integração com Gateway de Pagamento**: Para compra de créditos com dinheiro real
