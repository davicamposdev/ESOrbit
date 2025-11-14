# ESOrbit API

Serviço backend para ESOrbit, um sistema de marketplace de cosméticos construído com NestJS, implementando princípios de Clean Architecture e um sistema robusto de autenticação.

## Visão Geral

A API ESOrbit fornece uma solução backend completa para gerenciar itens cosméticos, inventários de usuários, compras e transações financeiras. O sistema foi projetado para sincronizar dados de fontes externas, gerenciar um catálogo de cosméticos e bundles, e lidar com todas as operações financeiras relacionadas a transações de usuários.

## Arquitetura

Este projeto segue os princípios de Clean Architecture, organizando o código em camadas distintas com clara separação de responsabilidades:

- **Camada de Domínio**: Entidades e interfaces de negócio principais
- **Camada de Aplicação**: Casos de uso e lógica de negócio
- **Camada de Infraestrutura**: Integrações externas (banco de dados, JWT, APIs externas)
- **Camada de Apresentação**: Controllers, DTOs e tratamento de requisições/respostas

A implementação adere aos princípios SOLID, garantindo manutenibilidade e escalabilidade.

## Principais Funcionalidades

### Autenticação e Autorização

- Autenticação baseada em JWT com tokens de acesso e refresh
- Hash de senhas com Argon2 para segurança aprimorada
- Guards de autenticação globais com decorators de rotas públicas
- Armazenamento seguro de refresh tokens baseado em cookies

### Gerenciamento de Catálogo

- Sincronização automatizada com fontes de dados de cosméticos externas
- Suporte para cosméticos individuais e pacotes de bundles
- Preços dinâmicos com suporte a promoções
- Capacidades abrangentes de filtragem e busca

### Sistema Financeiro

- Economia baseada em créditos com rastreamento de transações
- Processamento de compras e reembolsos
- Sistema de transferência entre usuários
- Histórico completo de transações e auditoria

### Sincronização de Dados

- Jobs agendados para atualizações automáticas de dados
- Logs de sincronização para monitoramento e troubleshooting
- Busca de dados específicos por idioma
- Tratamento de mudanças de disponibilidade e preços de cosméticos

## Estrutura do Projeto

```
src/
├── common/
│   └── database/              # Configuração global do Prisma
├── modules/
│   ├── auth/
│   │   ├── domain/            # Entidade User, interfaces
│   │   ├── application/       # Casos de uso de autenticação
│   │   ├── infrastructure/    # Implementações Prisma, JWT, Argon2
│   │   └── presentation/      # Controllers, DTOs, guards
│   ├── users/                 # Módulo de gerenciamento de usuários
│   ├── catalog/               # Cosméticos e bundles
│   ├── finance/               # Transações e compras
│   └── integration/           # Sincronização com API externa
└── main.ts

prisma/
├── schema.prisma              # Schema do banco de dados
└── migrations/                # Migrações do banco de dados
```

## Stack Tecnológica

- **Framework**: NestJS 11
- **Linguagem**: TypeScript 5
- **Banco de Dados**: PostgreSQL 16
- **ORM**: Prisma 6
- **Autenticação**: JWT + Passport
- **Hash de Senhas**: Argon2
- **Validação**: class-validator
- **Testes**: Jest

## Como Começar

### Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL 16
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
```

### Configuração do Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Popular o banco de dados
npm run seed
```

### Executando a Aplicação

```bash
# Modo desenvolvimento com hot reload
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:4000/api`

## Variáveis de Ambiente

Crie um arquivo `.env` no diretório api com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/esorbit"

# JWT
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="sua-chave-refresh-secreta"
JWT_REFRESH_EXPIRES_IN="7d"

# API
PORT=4000
API_PREFIX="api"
FRONTEND_URL="http://localhost:3000"

# API Externa (Opcional)
FORTNITE_API_URL="https://fortnite-api.com"
FORTNITE_API_KEY="sua-chave-api"
```

## Documentação da API

### Endpoints de Autenticação

- `POST /api/auth/register` - Registrar um novo usuário
- `POST /api/auth/login` - Fazer login e receber tokens
- `POST /api/auth/refresh` - Renovar access token
- `POST /api/auth/logout` - Fazer logout e invalidar tokens
- `GET /api/auth/me` - Obter informações do usuário atual

### Endpoints de Catálogo

- `GET /api/catalog/cosmetics` - Listar todos os cosméticos com filtros e paginação
- `GET /api/catalog/cosmetics/:id` - Obter informações detalhadas do cosmético
- `GET /api/catalog/bundles` - Listar todos os bundles disponíveis
- `GET /api/catalog/bundles/:id` - Obter detalhes do bundle com cosméticos incluídos

### Endpoints Financeiros

- `POST /api/finance/purchase` - Comprar um cosmético ou bundle
- `POST /api/finance/return` - Devolver um item comprado para reembolso
- `POST /api/finance/transfer` - Transferir créditos para outro usuário
- `GET /api/finance/transactions` - Obter histórico de transações do usuário

### Endpoints de Usuário

- `GET /api/users/me` - Obter perfil do usuário atual com saldo de créditos
- `GET /api/users/inventory` - Obter cosméticos comprados pelo usuário
- `GET /api/users/:id/inventory` - Obter inventário público de outro usuário

### Endpoints de Integração

- `POST /api/integration/sync` - Disparar sincronização de dados manualmente (apenas admin)
- `GET /api/integration/sync-logs` - Visualizar histórico de sincronizações

## Schema do Banco de Dados

A aplicação usa Prisma ORM com os seguintes modelos principais:

- **User**: Contas de usuário com credenciais de autenticação e saldo de créditos
- **Cosmetic**: Itens cosméticos individuais com preços e disponibilidade
- **Bundle**: Pacotes de múltiplos cosméticos com preços com desconto
- **BundleCosmetic**: Relacionamento entre bundles e cosméticos
- **Purchase**: Registros de compras de usuários
- **Return**: Registros de itens devolvidos
- **Transfer**: Transferências de créditos entre usuários
- **Transaction**: Ledger de transações financeiras
- **SyncLog**: Registros de operações de sincronização de dados

## Testes

O projeto inclui cobertura de testes abrangente:

```bash
# Testes unitários
npm test

# Testes E2E
npm run test:e2e

# Relatório de cobertura de testes
npm run test:cov

# Modo watch para desenvolvimento
npm run test:watch
```

Utilitários adicionais de teste estão disponíveis no diretório `test/`:

- `test/http/` - Arquivos de requisição HTTP para testes manuais da API com REST Client
- `test/scripts/` - Scripts bash para cenários de teste automatizados
- `test/e2e/` - Suítes de teste end-to-end cobrindo fluxos principais

## Fluxo de Desenvolvimento

### Qualidade de Código

```bash
# Fazer lint do código e corrigir problemas
npm run lint

# Formatar código com Prettier
npm run format
```

### Gerenciamento de Banco de Dados

```bash
# Criar uma nova migração após mudanças no schema
npx prisma migrate dev --name descricao_das_mudancas

# Resetar banco de dados (ATENÇÃO: deleta todos os dados)
npx prisma migrate reset

# Abrir Prisma Studio para gerenciamento visual de dados
npx prisma studio

# Gerar Prisma Client após mudanças no schema
npx prisma generate
```

### Debug

A aplicação usa o logger integrado do NestJS. O modo debug pode ser habilitado:

```bash
npm run start:debug
```

Então anexe seu debugger à porta 9229.

## Arquitetura dos Módulos

### Módulo Auth

Gerencia autenticação e autorização de usuários:

- **Domain**: Entidade User, interfaces de autenticação
- **Application**: Casos de uso de login, registro, refresh token
- **Infrastructure**: Repositório Prisma de usuários, serviço JWT, serviço de hash Argon2
- **Presentation**: Controller de auth, DTOs, estratégia JWT, guards

### Módulo Catalog

Gerencia cosméticos e bundles:

- **Domain**: Entidades Cosmetic e Bundle
- **Application**: Casos de uso de busca, filtro e recuperação
- **Infrastructure**: Repositórios Prisma
- **Presentation**: Controller de catálogo com query parameters

### Módulo Finance

Gerencia todas as operações financeiras:

- **Domain**: Entidades Transaction e Purchase
- **Application**: Casos de uso de compra, devolução, transferência com lógica de negócio
- **Infrastructure**: Repositórios Prisma com suporte a transações
- **Presentation**: Controller de finance com validação

### Módulo Integration

Gerencia sincronização de dados externos:

- **Application**: Jobs de sincronização, agendamento, tratamento de erros
- **Infrastructure**: Clientes de API externa, mapeadores de dados
- **Presentation**: Disparos de sincronização manual e visualização de logs

## Considerações de Segurança

- Todas as senhas são hasheadas usando Argon2 antes do armazenamento
- Tokens JWT são assinados e verificados em cada requisição
- Refresh tokens são armazenados em cookies HttpOnly para prevenir ataques XSS
- Validação de entrada é aplicada no nível de DTO usando class-validator
- CORS é configurado para aceitar requisições apenas de origens confiáveis
- Consultas ao banco de dados usam statements parametrizados via Prisma ORM
- Rate limiting deve ser implementado para uso em produção
- Variáveis de ambiente sensíveis não são commitadas no controle de versão

## Otimização de Performance

- Consultas ao banco de dados usam indexação apropriada em colunas acessadas frequentemente
- Paginação é implementada para datasets grandes
- Jobs de sincronização agendados executam durante horários de baixo uso
- Connection pooling está configurado para PostgreSQL
- Otimização de queries Prisma com select e include
- Cache de respostas pode ser adicionado para endpoints com muitas leituras

## Tratamento de Erros

A API usa respostas de erro consistentes:

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro detalhada",
  "error": "Bad Request"
}
```

Códigos de status HTTP comuns:

- 200: Sucesso
- 201: Criado
- 400: Bad Request (erros de validação)
- 401: Não Autorizado (token ausente ou inválido)
- 403: Proibido (permissões insuficientes)
- 404: Não Encontrado
- 409: Conflito (recurso duplicado)
- 500: Erro Interno do Servidor

## Resolução de Problemas

### Problemas Comuns

**Erros de conexão com banco de dados**:

- Verifique se o PostgreSQL está rodando
- Confira se o `DATABASE_URL` está formatado corretamente
- Certifique-se de que o banco de dados existe e o usuário tem permissões apropriadas

**Falhas de verificação JWT**:

- Certifique-se de que `JWT_SECRET` e `JWT_REFRESH_SECRET` estão definidos
- Verifique se os tokens não expiraram
- Confira se os secrets correspondem entre reinicializações da aplicação

**Conflitos de migração**:

- Se as migrações estão dessincronizadas, use `npx prisma migrate reset` em desenvolvimento
- Para produção, resolva conflitos manualmente e crie novas migrações

**Porta já em uso**:

- Altere a variável de ambiente `PORT`
- Mate o processo usando a porta: `lsof -ti:4000 | xargs kill -9`

**Problemas de geração do Prisma Client**:

- Delete `node_modules/.prisma` e execute `npx prisma generate` novamente
- Certifique-se de que schema.prisma não tem erros de sintaxe

## Deploy

Para deploy em produção:

1. Defina `NODE_ENV=production`
2. Use secrets fortes e únicos para tokens JWT
3. Configure origens CORS apropriadas
4. Habilite HTTPS e defina cookie `secure: true`
5. Configure logging e monitoramento apropriados
6. Configure backups do banco de dados
7. Use um gerenciador de processos como PM2
8. Configure rate limiting
9. Configure tamanho apropriado do pool de conexões
10. Use configuração específica por ambiente

## Recursos Adicionais

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Clean Architecture por Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Princípios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Boas Práticas JWT](https://tools.ietf.org/html/rfc8725)

## Licença

Este projeto está licenciado sob a Licença MIT.
