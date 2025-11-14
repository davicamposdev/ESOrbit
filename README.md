# ESOrbit

> **Documentação**: [API](./api/README.md) | [Web](./web/README.md)

ESOrbit é uma plataforma completa de marketplace de cosméticos que permite aos usuários navegar, comprar e gerenciar itens cosméticos digitais. O sistema apresenta um fluxo completo de autenticação, gerenciamento de inventário em tempo real, transações baseadas em créditos e sincronização automatizada de dados com fontes externas.

## Visão Geral do Projeto

A aplicação consiste em dois componentes principais:

- **API**: Serviço backend construído com NestJS, fornecendo endpoints RESTful para autenticação, gerenciamento de catálogo e operações financeiras
- **Web**: Aplicação frontend construída com Next.js 16, oferecendo uma interface intuitiva para navegação de cosméticos, gerenciamento de inventário e processamento de transações

O sistema foi projetado para sincronizar automaticamente dados de cosméticos de APIs externas, manter informações de preços, suportar pacotes de bundles e rastrear todas as transações financeiras com trilha completa de auditoria.

## Arquitetura

O projeto segue práticas modernas de desenvolvimento:

- **Backend**: Clean Architecture com clara separação entre as camadas de domínio, aplicação, infraestrutura e apresentação
- **Frontend**: Padrão Feature-Sliced Design para organização de código modular e sustentável
- **Banco de Dados**: PostgreSQL com Prisma ORM para operações type-safe no banco
- **Autenticação**: Sistema baseado em JWT com tokens de acesso e refresh
- **Containerização**: Docker Compose para fácil implantação e desenvolvimento

## Como Começar

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20 ou superior (para desenvolvimento local)
- PostgreSQL 16 (gerenciado pelo Docker)

### Início Rápido com Docker

Toda a stack da aplicação pode ser executada usando Docker Compose:

```bash
# Construir todos os containers
sudo docker compose build

# Iniciar todos os serviços em modo detached
docker compose up -d
```

Isso iniciará os seguintes serviços:

- **PostgreSQL**: Servidor de banco de dados na porta 5432
- **API**: Serviço backend na porta 4000
- **Web**: Aplicação frontend na porta 3000
- **CloudBeaver**: Ferramenta de gerenciamento de banco de dados na porta 8978 (opcional, requer `--profile tools`)

### Acessando a Aplicação

Após iniciar os serviços:

- Frontend: http://localhost:3000
- API: http://localhost:4000/api
- CloudBeaver (opcional): http://localhost:8978

### Configuração de Ambiente

Antes de construir, crie os arquivos de ambiente (Siga .env.example):

**api/.env**:

```env
DATABASE_URL="postgresql://esorbit:esorbit123@postgres:5432/esorbit?schema=public"
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="sua-chave-refresh-secreta"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
API_PREFIX="api"
FRONTEND_URL="http://localhost:3000"
```

**web/.env.local**:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=ESOrbit
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Estrutura do Projeto

```
ESOrbit/
├── api/                    # Serviço backend
│   ├── src/
│   │   ├── modules/        # Módulos de features
│   │   │   ├── auth/       # Autenticação
│   │   │   ├── catalog/    # Catálogo de cosméticos
│   │   │   ├── finance/    # Transações
│   │   │   ├── integration/# Sincronização com API externa
│   │   │   └── users/      # Gerenciamento de usuários
│   │   ├── common/         # Utilitários compartilhados
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── test/
│
├── web/                    # Aplicação frontend
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Páginas de autenticação
│   │   ├── catalog/        # Páginas do catálogo
│   │   ├── dashboard/      # Dashboard do usuário
│   │   └── ...
│   ├── features/           # Módulos de features
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── finance/
│   │   └── ...
│   └── shared/             # Componentes compartilhados
│
└── docker/                 # Configurações do Docker
```

## Principais Funcionalidades

### Gerenciamento de Usuários

- Registro e autenticação seguros
- Gerenciamento de perfil
- Rastreamento de saldo de créditos
- Gerenciamento de inventário

### Sistema de Catálogo

- Navegação de cosméticos individuais
- Visualização de pacotes de bundles
- Filtros por tipo, raridade e disponibilidade
- Funcionalidade de busca
- Preços dinâmicos e promoções

### Operações Financeiras

- Compras baseadas em créditos
- Processamento de devoluções/reembolsos
- Transferências de créditos entre usuários
- Histórico completo de transações
- Gerenciamento automático de ledger

### Sincronização de Dados

- Sincronização automática com APIs externas de cosméticos
- Jobs agendados para atualização de dados
- Busca de dados específicos por idioma
- Logs de sincronização e monitoramento
- Processamento de mudanças de preços e disponibilidade

### Segurança

- Autenticação JWT com tokens de refresh
- Hash de senhas com Argon2
- Armazenamento de tokens em cookies HttpOnly
- Proteção CORS
- Validação e sanitização de entradas

## Desenvolvimento

### Desenvolvimento Local (Sem Docker)

Para desenvolvimento fora do Docker:

**API**:

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

**Web**:

```bash
cd web
npm install
npm run dev
```

Consulte os arquivos README individuais para instruções detalhadas de desenvolvimento:

- [Documentação da API](./api/README.md)
- [Documentação Web](./web/README.md)

## Comandos Docker

```bash
# Construir serviços
docker compose build

# Iniciar todos os serviços
docker compose up -d

# Parar todos os serviços
docker compose down

# Ver logs
docker compose logs -f esorbit-api # ou esorbit-web caso queira os logs do front

# Reconstruir um serviço específico
docker compose build api
docker compose up -d api

# Executar ferramenta de gerenciamento de banco de dados
docker compose --profile tools up -d cloudbeaver

# Remover todos os volumes (ATENÇÃO: deleta dados)
docker compose down -v
```

## Gerenciamento de Banco de Dados

O projeto inclui CloudBeaver para gerenciamento visual do banco de dados. Para usá-lo:

```bash
docker compose --profile tools up -d cloudbeaver
```

Depois acesse http://localhost:8978 e configure uma conexão para:

- Host: `postgres`
- Porta: `5432`
- Banco de dados: `esorbit`
- Usuário: `esorbit`
- Senha: `esorbit123`

## Resolução de Problemas

**Conflitos de porta**: Se as portas já estiverem em uso, modifique os mapeamentos de porta no `docker-compose.yml`

**Problemas de conexão com banco de dados**: Certifique-se de que o container PostgreSQL está saudável antes de iniciar a API

**Permissão negada**: Use `sudo` com comandos docker se seu usuário não estiver no grupo docker

**Container não inicia**: Verifique os logs com `docker compose logs <nome-do-serviço>`

## Stack Tecnológica

### Backend

- NestJS 11
- TypeScript 5
- Prisma 6
- PostgreSQL 16
- JWT + Passport
- Argon2

### Frontend

- Next.js 16
- React 19
- TypeScript 5
- Ant Design 5
- Tailwind CSS 4

### DevOps

- Docker
- Docker Compose
- PostgreSQL Alpine
- CloudBeaver

## Nota sobre Funcionalidades Planejadas

Um painel administrativo foi originalmente planejado como parte deste projeto. O painel admin incluiria:

- **Configuração de Idioma**: Capacidade de configurar as definições de idioma da aplicação e do banco de dados, pois todos os dados e informações de cosméticos seriam buscados baseados no idioma selecionado
- **Relatórios de Sincronização**: Relatórios detalhados sobre operações de sincronização do banco de dados, incluindo taxas de sucesso, itens processados e quaisquer erros encontrados
- **Sincronização Manual**: Interface para disparar jobs de sincronização de dados manualmente quando necessário
- **Gerenciamento de Usuários**: Administração completa de usuários com visualizações detalhadas de contas de usuário, histórico de compras, inventários e a capacidade de gerenciar créditos e permissões de usuários
- **Relatórios Financeiros**: Análises abrangentes de vendas e lucro, incluindo receita total, volumes de transação e tendências financeiras ao longo do tempo

Infelizmente, devido a restrições de tempo, a implementação do frontend deste painel administrativo não foi concluída. Esta funcionalidade teria sido uma adição valiosa ao sistema, fornecendo aos administradores ferramentas poderosas para configuração e supervisão do sistema. A infraestrutura backend para suportar a maioria dessas funcionalidades já está implementada (logs de sincronização, rastreamento de transações, endpoints de gerenciamento de usuários, sincronização do banco em outras linguagens), mas a interface de usuário permanece não implementada.

## Licença

MIT

## Contribuindo

Este projeto foi desenvolvido como parte de uma avaliação técnica. Para questões ou contribuições, consulte a documentação individual dos módulos.
