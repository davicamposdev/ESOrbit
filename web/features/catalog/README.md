# Feature Catalog

Feature completa de catálogo de cosméticos do Fortnite, seguindo a arquitetura limpa e os mesmos padrões da feature de autenticação.

## 📁 Estrutura

```
features/catalog/
├── components/
│   ├── cosmetic-card.tsx       # Card de exibição do cosmético
│   ├── catalog-filters.tsx     # Filtros de busca
│   ├── pagination.tsx          # Componente de paginação
│   └── index.ts
├── hooks/
│   ├── use-catalog.tsx         # Hook principal do catálogo
│   └── index.ts
├── services/
│   ├── catalog.service.ts      # Serviço de comunicação com a API
│   └── index.ts
└── index.ts
```

## 🎯 Funcionalidades

### Listagem de Cosméticos
- Exibição em grid responsivo
- Paginação completa
- Filtros avançados:
  - Tipo (outfit, emote, glider, pickaxe, etc.)
  - Raridade (common, rare, epic, legendary, etc.)
  - Novos itens
  - Bundles
  - Disponibilidade
  - Itens em promoção
- Ordenação e busca

### Visualização de Detalhes
- Modal com informações completas
- Imagem em alta qualidade
- Preços (base e promocional)
- Tags visuais (NOVO, BUNDLE)
- Status de disponibilidade

### Integração com API
- Endpoints do módulo catalog da API
- Sincronização de dados
- Tratamento de erros
- Loading states

## 🎨 Componentes

### CosmeticCard
Card visual para exibir um cosmético com:
- Imagem do item
- Nome e descrição
- Raridade com cores
- Preço (com suporte a promoções)
- Badges (NOVO, BUNDLE)
- Estado de disponibilidade

### CatalogFilters
Sistema de filtros com Ant Design:
- Select para tipo e raridade
- Checkboxes para filtros booleanos
- Select para quantidade de itens por página
- Botão de limpar filtros

### Pagination
Paginação usando Ant Design Pagination:
- Navegação entre páginas
- Indicador de total de itens
- Disabled durante loading

## 🔧 Services

### CatalogService
Serviço para comunicação com a API:

```typescript
// Listar cosméticos com filtros
await catalogService.listCosmetics({
  type: 'outfit',
  rarity: 'epic',
  isNew: true,
  page: 1,
  pageSize: 20
});

// Sincronizar todos os cosméticos
await catalogService.syncAll({ language: 'pt-BR' });

// Sincronizar apenas novos
await catalogService.syncNew({ language: 'pt-BR' });

// Sincronizar loja
await catalogService.syncShop({ language: 'pt-BR' });
```

## 🎣 Hooks

### useCatalog
Hook principal para gerenciar estado do catálogo:

```typescript
const {
  cosmetics,      // Lista de cosméticos
  loading,        // Estado de carregamento
  error,          // Mensagem de erro
  total,          // Total de itens
  page,           // Página atual
  pageSize,       // Itens por página
  totalPages,     // Total de páginas
  fetchCosmetics, // Buscar cosméticos
  syncAll,        // Sincronizar todos
  syncNew,        // Sincronizar novos
  syncShop,       // Sincronizar loja
  clearError,     // Limpar erro
} = useCatalog();
```

## 📄 Páginas

### /catalog
Página principal do catálogo com:
- Header com navegação
- Filtros avançados
- Grid responsivo de cosméticos
- Paginação
- Modal de detalhes
- Exibição de créditos do usuário (se autenticado)

## 🎨 Design System

Utiliza **Ant Design** para componentes UI:
- Card
- Select
- Checkbox
- Button
- Modal
- Pagination
- Tag
- Badge
- Typography
- Layout

## 🔄 Fluxo de Dados

```
1. Usuário acessa /catalog
2. useEffect dispara fetchCosmetics()
3. catalogService.listCosmetics() → API
4. API retorna dados paginados
5. Estado atualizado via useCatalog
6. Componentes re-renderizam
7. Usuário aplica filtros
8. handleFilter() atualiza filtros
9. Nova requisição com filtros
10. Grid atualizado
```

## 🚀 Como Usar

### Importar a feature

```typescript
import { useCatalog, CosmeticCard, CatalogFilters } from '@/features/catalog';
```

### Usar em um componente

```typescript
'use client';

import { useEffect } from 'react';
import { useCatalog, CatalogFilters, CosmeticCard } from '@/features/catalog';

export default function MeuCatalogo() {
  const { cosmetics, loading, fetchCosmetics } = useCatalog();

  useEffect(() => {
    fetchCosmetics({ page: 1, pageSize: 20 });
  }, []);

  return (
    <div>
      <CatalogFilters 
        onFilter={(filters) => fetchCosmetics(filters)}
        loading={loading}
      />
      
      <div className="grid grid-cols-4 gap-4">
        {cosmetics.map(cosmetic => (
          <CosmeticCard 
            key={cosmetic.id}
            cosmetic={cosmetic}
            onSelect={(c) => console.log('Selected:', c)}
          />
        ))}
      </div>
    </div>
  );
}
```

## 🔗 Integração com Auth

O catálogo está integrado com a feature de autenticação:
- Exibe créditos do usuário no header
- Prepara para funcionalidade de compra (próximo passo)
- Usa o mesmo apiClient compartilhado

## 📝 Tipos TypeScript

Todos os tipos estão definidos no `catalog.service.ts`:
- `Cosmetic` - Entidade completa do cosmético
- `ListCosmeticsParams` - Parâmetros de filtro
- `ListCosmeticsResponse` - Resposta da listagem
- `SyncCosmeticsDto` - DTO de sincronização
- `SyncResponse` - Resposta de sincronização

## ✅ Próximos Passos

- [ ] Implementar funcionalidade de compra
- [ ] Adicionar carrinho de compras
- [ ] Sistema de favoritos
- [ ] Histórico de compras
- [ ] Visualização 3D dos cosméticos (se disponível)
- [ ] Compartilhamento de itens
- [ ] Sistema de recomendações

## 🧪 Testando

Para testar a feature localmente:

1. Certifique-se de que a API está rodando na porta 4000
2. Execute o frontend: `npm run dev`
3. Acesse: http://localhost:3000/catalog
4. Use os filtros para buscar cosméticos
5. Clique nos cards para ver detalhes

## 📚 Referências

- [Documentação Ant Design](https://ant.design/)
- [API Catalog Module](../../api/docs/modules/catalog.md)
- [API Endpoints](../../api/docs/api/endpoints.md)
