# Módulo Catalog

O módulo Catalog é responsável por sincronizar e armazenar os cosméticos do Fortnite no banco de dados local, consumindo os dados do módulo Integration.

## Arquitetura

O módulo segue os princípios da Clean Architecture:

```
catalog/
├── domain/
│   ├── entities/
│   │   └── cosmetic.entity.ts         # Entidade de domínio
│   └── repositories/
│       └── cosmetic.repository.interface.ts  # Interface do repositório
├── application/
│   └── use-cases/
│       ├── sync-cosmetics.use-case.ts        # Sincroniza todos os cosméticos
│       ├── sync-new-cosmetics.use-case.ts    # Sincroniza apenas novos
│       └── list-cosmetics.use-case.ts        # Lista cosméticos do banco
├── infrastructure/
│   └── repositories/
│       └── prisma-cosmetic.repository.ts     # Implementação com Prisma
├── presentation/
│   ├── controllers/
│   │   └── catalog.controller.ts             # Controller REST
│   └── dtos/
│       ├── list-cosmetics.dto.ts
│       └── sync-cosmetics.dto.ts
└── catalog.module.ts
```

## Funcionalidades

### 1. Sincronização de Cosméticos

#### Sincronizar Todos

```http
POST /catalog/sync
Content-Type: application/json

{
  "language": "pt-BR"
}
```

Busca todos os cosméticos da API externa e armazena/atualiza no banco de dados.

#### Sincronizar Novos

```http
POST /catalog/sync/new
Content-Type: application/json

{
  "language": "pt-BR"
}
```

Busca apenas os novos cosméticos e marca com `isNew: true`.

### 2. Listagem de Cosméticos

```http
GET /catalog/cosmetics?type=outfit&rarity=epic&isNew=true&page=1&pageSize=20
```

Parâmetros de query:

- `type`: Tipo do cosmético (outfit, pickaxe, glider, etc)
- `rarity`: Raridade (common, rare, epic, legendary, etc)
- `isNew`: Apenas novos cosméticos
- `onSale`: Apenas cosméticos em promoção
- `isBundle`: Apenas bundles
- `page`: Número da página (padrão: 1)
- `pageSize`: Itens por página (padrão: 50)

## Dependências

O módulo depende de:

- **IntegrationModule**: Para buscar dados da API externa
- **PrismaModule**: Para acesso ao banco de dados

## Fluxo de Dados

```
1. Cliente -> POST /catalog/sync
2. CatalogController -> SyncCosmeticsUseCase
3. SyncCosmeticsUseCase -> FetchAllCosmeticsUseCase (Integration)
4. SyncCosmeticsUseCase -> PrismaCosmeticRepository
5. PrismaCosmeticRepository -> Banco de Dados (upsert)
6. Resposta com estatísticas de sincronização
```

## Modelo de Dados

### Cosmetic Entity

```typescript
{
  id: string;                    // UUID interno
  externalId: string;            // ID da API externa (único)
  name: string;                  // Nome do cosmético
  type: string;                  // Tipo (outfit, pickaxe, etc)
  rarity: string;                // Raridade
  imageUrl: string;              // URL da imagem
  addedAt: Date;                 // Data de adição no Fortnite
  isNew: boolean;                // Marcado como novo
  onSale: boolean;               // Em promoção
  salePrice: number | null;      // Preço promocional
  isBundle: boolean;             // É um bundle
  childrenExternalIds: string[]; // IDs dos itens do bundle
  createdAt: Date;
  updatedAt: Date;
}
```

## Testes

Para testar o módulo, use o arquivo `test/http/catalog.http` com a extensão REST Client do VS Code.

## Manutenção

O código foi desenvolvido seguindo os princípios:

- **SOLID**: Separação de responsabilidades
- **Clean Architecture**: Independência de frameworks
- **DRY**: Reutilização de código
- **KISS**: Simplicidade na implementação
