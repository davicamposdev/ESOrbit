# Módulo de Integração - ESOrbit

Módulo responsável pela integração com a API externa do Fortnite, seguindo os princípios de Clean Architecture e Anti-Corruption Layer.

## Estrutura

```
integration/
├── domain/                      # Camada de domínio (agnóstico)
│   ├── entities/               # Entidades do domínio
│   │   └── integration-cosmetic.entity.ts
│   ├── enums/                  # Enumerações
│   │   ├── cosmetic-type.enum.ts
│   │   └── rarity.enum.ts
│   └── errors/                 # Erros canônicos
│       └── integration.errors.ts
│
├── application/                # Camada de aplicação
│   ├── ports/                 # Portas (interfaces)
│   │   └── cosmetics-read.port.ts
│   └── use-cases/             # Casos de uso
│       ├── fetch-all-cosmetics.use-case.ts
│       ├── fetch-new-cosmetics.use-case.ts
│       └── health-check.use-case.ts
│
├── infrastructure/            # Camada de infraestrutura
│   ├── adapters/             # Adaptadores das portas
│   │   └── fortnite-api.adapter.ts
│   ├── config/               # Configuração
│   │   └── integration-config.service.ts
│   ├── http/                 # Cliente HTTP
│   │   └── http-client.service.ts
│   ├── mappers/              # Mapeadores (anti-corrupção)
│   │   └── cosmetic.mapper.ts
│   ├── observability/        # Métricas e logs
│   │   └── metrics.service.ts
│   ├── resilience/           # Rate limiter e circuit breaker
│   │   ├── circuit-breaker.service.ts
│   │   └── rate-limiter.service.ts
│   └── schemas/              # Schema guards
│       ├── external-cosmetic.dto.ts
│       └── schema-guard.ts
│
├── presentation/             # Camada de apresentação
│   └── controllers/
│       └── integration.controller.ts
│
└── integration.module.ts     # Módulo NestJS
```

## Funcionalidades

### 1. Config Central

- Validação de variáveis de ambiente na inicialização
- Valores padrão seguros
- Configurações: `FORTNITE_API_BASE`, `TIMEOUT_MS`, `RETRY_ATTEMPTS`, `RETRY_BACKOFF_MS`, `RATE_LIMIT_RPS`

### 2. HTTP Client com Middlewares

- **Request ID**: Geração automática via UUID
- **Timeout**: Configurável por ambiente
- **User-Agent**: Identificação do cliente
- **Retry com Backoff**: Exponencial em caso de falha
- **Mapeamento de Erros**: Conversão para erros canônicos

### 3. Schema Guards

- Validação estrita de schemas externos
- Detecção de mudanças na API do provedor
- Proteção contra dados inválidos

### 4. Mappers (Anti-Corruption Layer)

- **Type Mapping**: Normalização de tipos de cosméticos
- **Rarity Mapping**: Mapeamento de raridades
- **Image Selection**: Escolha da melhor resolução
- **Date Normalization**: Parse para UTC com validação
- **Unknown Values**: Log + fallback para `UNKNOWN`

### 5. Adapters

- Implementação da `CosmeticsReadPort`
- Rate limiting integrado
- Circuit breaker para resiliência
- Sem side-effects (somente leitura)

### 6. Casos de Uso

- **Fetch Paginated**: Iterator/generator para paginação resiliente
- **Fetch New**: Sincronização de novos cosméticos
- **Health Check**: Ping com latência

### 7. Observabilidade

- **Logs Estruturados**: JSON com contexto completo
- **Métricas**:
  - `integration_http_request_duration_ms`: Histograma de latência
  - `integration_http_requests_total`: Contador de requests
  - `integration_schema_validation_failures_total`: Falhas de validação
  - `integration_mapper_unknown_values_total`: Valores desconhecidos

### 8. Resiliência

- **Rate Limiter**: Token bucket algorithm
- **Circuit Breaker**: Estados CLOSED/OPEN/HALF_OPEN
- **Retry Strategy**: Backoff exponencial

## Variáveis de Ambiente

```bash
# API do Fortnite
FORTNITE_API_BASE=https://fortnite-api.com/v2

# Timeouts e retries
TIMEOUT_MS=10000
RETRY_ATTEMPTS=3
RETRY_BACKOFF_MS=1000

# Rate limiting
RATE_LIMIT_RPS=5
```

## Endpoints Disponíveis

### Health Check

```
GET /api/integration/health
```

Retorna a latência e status da API externa.

### Fetch New Cosmetics

```
GET /api/integration/cosmetics/new?language=pt-BR
```

Retorna array de novos cosméticos normalizados. Suporta o parâmetro `language` (padrão: `pt-BR`).

### Fetch All Cosmetics

```
GET /api/integration/cosmetics?language=pt-BR&page=1&pageSize=100
```

Retorna todos os cosméticos da API externa com paginação em memória.

**Importante:** A API externa do Fortnite retorna todos os cosméticos de uma vez. A paginação é implementada em memória para facilitar o consumo. Parâmetros disponíveis:

- `language`: Idioma dos dados (padrão: `pt-BR`)
- `page`: Número da página (padrão: 1)
- `pageSize`: Itens por página (padrão: 100)

**Resposta:**

```json
{
  "items": [...],
  "total": 5000,
  "page": 1,
  "pageSize": 100,
  "totalPages": 50
}
```

### Métricas

```
GET /api/integration/metrics
```

Retorna resumo das métricas em JSON.

```
GET /api/integration/metrics/prometheus
```

Retorna métricas no formato Prometheus.

## Uso Programático

### Injetar no Catalog Module

```typescript
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
})
export class CatalogModule {}
```

### Usar nos Use Cases

```typescript
import { FetchNewCosmeticsUseCase } from '../integration/application/use-cases/fetch-new-cosmetics.use-case';

@Injectable()
export class SyncNewCosmeticsUseCase {
  constructor(private readonly fetchNewCosmetics: FetchNewCosmeticsUseCase) {}

  async execute() {
    const cosmetics = await this.fetchNewCosmetics.execute({
      language: 'pt-BR',
    });

    // Processar e persistir no catálogo
    for (const cosmetic of cosmetics) {
      // Lógica do catalog
    }
  }
}
```

### Buscar Todos os Cosméticos

````typescript
import { FetchAllCosmeticsUseCase } from '../integration/application/use-cases/fetch-all-cosmetics.use-case';

@Injectable()
export class BootstrapCatalogUseCase {
  constructor(
    private readonly fetchAllCosmetics: FetchAllCosmeticsUseCase,
  ) {}

  async execute() {
    // Busca todos os cosméticos (a API retorna tudo de uma vez)
    // A paginação é feita em memória para facilitar o processamento
    const result = await this.fetchAllCosmetics.execute({
      language: 'pt-BR',
      page: 1,
      pageSize: 100
    });

    // Processar batch de cosméticos
    await this.processBatch(result.items);

    // Se necessário, buscar próximas páginas
    if (result.page < result.totalPages) {
      // Buscar página 2, 3, etc...
    }
  }
}
```## Regras de Mapeamento

### Types

- Tabela de correspondência interna
- Valores desconhecidos → `UNKNOWN` + log

### Rarities

- Mapeamento flexível (case-insensitive)
- Valores inesperados → `UNKNOWN` + métrica

### Dates

- Parse para UTC
- Validação de range (2017-2100)
- Fallback para data atual em caso de erro

### IDs

- `externalId` sempre presente
- Nenhum ID interno gerado no integration

### URLs

- Prioridade: featured > icon > smallIcon > other
- Placeholder em caso de ausência

### Bundles

- `childrenExternalIds` populado se disponível
- Array vazio se não houver composição

## Contratos de Saída

### IntegrationCosmetic

```typescript
{
  externalId: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: Rarity;
  imageUrl: string;
  addedAt: string; // ISO 8601 UTC
  childrenExternalIds: string[];
}
````

### PaginatedCosmeticsResult → CosmeticsResult

```typescript
{
  items: IntegrationCosmetic[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Nota:** Esta paginação é implementada em memória, já que a API externa retorna todos os dados de uma vez.

## Garantias

1. **Campos validados**: Schema guard antes do mapeamento
2. **Enums normalizados**: Mapeamento consistente com fallback
3. **Datas em UTC**: ISO 8601 com validação
4. **URLs válidas**: Priorização + fallback
5. **Sem side-effects**: Portas não gravam no banco

## Testes

Para testar manualmente:

```bash
# Health check
curl http://localhost:4000/api/integration/health

# Novos cosméticos (em português)
curl http://localhost:4000/api/integration/cosmetics/new?language=pt-BR

# Todos os cosméticos paginados
curl "http://localhost:4000/api/integration/cosmetics?language=pt-BR&page=1&pageSize=50"

# Métricas
curl http://localhost:4000/api/integration/metrics
```

## Próximos Passos

- [ ] Adicionar cache leve (TTL 30-120s)
- [ ] Implementar testes unitários
- [ ] Implementar testes de integração
- [ ] Adicionar documentação Swagger/OpenAPI
- [ ] Configurar alerts para circuit breaker
- [ ] Dashboard de métricas (Grafana)
