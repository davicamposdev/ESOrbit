# Compra de Bundles

## Visão Geral

O sistema agora suporta a compra de **bundles** (pacotes de cosméticos). Quando um usuário compra um bundle, ele recebe todos os itens individuais que fazem parte dele.

## Como Funciona

### 1. Estrutura de Dados

Um bundle é representado por:

- Um registro na tabela `Bundle` com ID único e nome
- Itens relacionados na tabela `BundleItem` que conectam o bundle aos cosméticos individuais
- Cada item do bundle é um cosmético normal na tabela `Cosmetic`
- O preço do bundle é calculado como a **soma dos preços dos itens disponíveis**

### 2. Processo de Compra

Quando um bundle é comprado:

1. **Validações iniciais**:
   - Verifica se o bundle existe
   - Verifica se o bundle tem itens
   - Verifica se os itens estão disponíveis
   - Verifica se os itens têm preço válido
   - Calcula o preço total (soma dos itens disponíveis)
   - Verifica se o usuário tem créditos suficientes

2. **Transação atômica**:
   - Cria uma transação financeira com o valor total calculado
   - Debita os créditos do usuário
   - Para cada item disponível do bundle:
     - Verifica se o usuário já possui o item
     - Se não possuir, cria uma compra individual com `isFromBundle = true`
   - A primeira compra criada é considerada a "principal" e as demais referenciam ela via `parentPurchaseId`

3. **Resultado**:
   - Retorna a compra principal (primeiro item)
   - Retorna todas as compras dos itens do bundle
   - Retorna o total de itens adicionados ao inventário

## Endpoint da API

### Comprar Bundle

```http
POST /api/finance/purchases/bundle
Content-Type: application/json
Authorization: Bearer {token}

{
  "bundleId": "uuid-do-bundle"
}
```

#### Resposta de Sucesso (201 Created)

```json
{
  "mainPurchase": {
    "id": "uuid",
    "userId": "uuid",
    "cosmeticId": "uuid-primeiro-item",
    "transactionId": "uuid",
    "isFromBundle": true,
    "parentPurchaseId": null,
    "status": "active",
    "returnedAt": null,
    "createdAt": "2025-11-10T...",
    "updatedAt": "2025-11-10T..."
  },
  "bundleItemsPurchases": [
    {
      "id": "uuid",
      "userId": "uuid",
      "cosmeticId": "uuid-item-1",
      "transactionId": "uuid",
      "isFromBundle": true,
      "parentPurchaseId": "uuid-compra-principal",
      "status": "active",
      "returnedAt": null,
      "createdAt": "2025-11-10T...",
      "updatedAt": "2025-11-10T..."
    }
  ],
  "totalItems": 3
}
```

#### Possíveis Erros

- **400 Bad Request**:
  - `"Bundle has no items"` - Bundle vazio
  - `"Bundle has no available items"` - Nenhum item disponível
  - `"Item 'X' does not have a valid price"` - Item sem preço válido
  - `"Insufficient credits"` - Créditos insuficientes

- **404 Not Found**:
  - `"Bundle not found"` - Bundle não existe
  - `"User not found"` - Usuário não existe

- **401 Unauthorized**: Token inválido ou ausente

## Características Importantes

### 1. Prevenção de Duplicatas

Se o usuário já possui algum item do bundle individualmente, o sistema **não cria** uma compra duplicada para esse item. Apenas itens que o usuário ainda não possui são adicionados ao inventário.

### 2. Transações Atômicas

Toda a operação é executada em uma transação do Prisma. Se algo falhar durante o processo, todas as alterações são revertidas automaticamente.

### 3. Relação Hierárquica

As compras dos itens do bundle mantêm referência à compra principal através de:

- `isFromBundle = true`: Indica que a compra veio de um bundle
- `parentPurchaseId`: ID da compra principal do bundle

Isso permite:

- Rastrear a origem dos itens
- Implementar devoluções em lote (devolver o bundle inteiro)
- Gerar relatórios sobre vendas de bundles

### 4. Pagamento Calculado

O usuário paga pela soma dos preços dos itens disponíveis no bundle. O preço é calculado dinamicamente no momento da compra, considerando apenas os itens que estão com `isAvailable = true` e têm `currentPrice` definido.

## Exemplo de Uso

```bash
# 1. Listar bundles disponíveis
GET /api/catalog/bundles

# 2. Ver detalhes de um bundle específico (opcional)
GET /api/catalog/bundles/{bundleId}

# 3. Comprar um bundle
POST /api/finance/purchases/bundle
{
  "bundleId": "bundle-uuid"
}

# 4. Verificar todas as compras (incluindo itens do bundle)
GET /api/finance/purchases
```

## Considerações para Desenvolvimento

### Para adicionar novos bundles:

1. Criar um registro na tabela `Bundle` com `externalId` e `name`
2. Criar os cosméticos individuais na tabela `Cosmetic`
3. Definir `currentPrice` e `isAvailable = true` para cada item
4. Criar registros na tabela `BundleItem` associando o bundle aos itens

### Para devoluções de bundles:

Atualmente, a devolução funciona item por item. Uma evolução futura pode incluir:

- Devolução do bundle inteiro de uma vez
- Cálculo proporcional se alguns itens já foram consumidos
- Política de devolução específica para bundles

## Arquivos Modificados/Criados

- `src/modules/finance/application/use-cases/purchase-bundle.use-case.ts` - Lógica de compra
- `src/modules/finance/presentation/dtos/purchase-bundle.dto.ts` - DTO de entrada
- `src/modules/finance/presentation/dtos/purchase-bundle-response.dto.ts` - DTO de resposta
- `src/modules/finance/presentation/controllers/finance.controller.ts` - Novo endpoint
- `src/modules/finance/finance.module.ts` - Registro do use case
- `test/http/finance.http` - Testes HTTP

## Schema do Banco de Dados

As tabelas relevantes já estão criadas no schema Prisma:

```prisma
model Bundle {
  id         String   @id @default(uuid())
  externalId String   @unique @map("external_id")
  name       String   @map("name")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  items BundleItem[]
}

model BundleItem {
  id          String   @id @default(uuid())
  bundleId    String   @map("bundle_id")
  itemId      String   @map("item_id")
  description String   @map("description")

  bundle Bundle   @relation(fields: [bundleId], references: [id])
  item   Cosmetic @relation(fields: [itemId], references: [id])
  // ...
}

model Purchase {
  // ...
  isFromBundle     Boolean        @default(false) @map("is_from_bundle")
  parentPurchaseId String?        @map("parent_purchase_id")
  parentPurchase   Purchase?      @relation("BundlePurchase", fields: [parentPurchaseId])
  childPurchases   Purchase[]     @relation("BundlePurchase")
  // ...
}
```
