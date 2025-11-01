# 🧪 Testes - ESOrbit API

Estrutura organizada de testes para a aplicação.

---

## 📁 Estrutura

```
test/
├── README.md              # Este arquivo
│
├── e2e/                   # Testes end-to-end
│   ├── auth.e2e-spec.ts   # Testes de autenticação
│   └── users.e2e-spec.ts  # Testes de usuários
│
├── http/                  # Arquivos HTTP para testes manuais
│   ├── auth.http          # Requisições de autenticação
│   └── users.http         # Requisições de usuários
│
├── scripts/               # Scripts de teste automatizados
│   └── test-auth.sh       # Script bash para testar auth
│
└── jest-e2e.json          # Configuração Jest E2E
```

---

## 🚀 Como Executar

### Testes Automatizados (Jest)

```bash
# Todos os testes E2E
npm run test:e2e

# Testes unitários
npm test

# Com cobertura
npm run test:cov

# Watch mode
npm run test:watch
```

### Script Bash

```bash
# Tornar executável
chmod +x test/scripts/test-auth.sh

# Executar
./test/scripts/test-auth.sh
```

**Requisito:** `jq` instalado para formatar JSON

```bash
# Ubuntu/Debian
sudo apt install jq

# Mac
brew install jq
```

### Arquivos HTTP (VS Code)

1. Instale a extensão **REST Client** no VS Code
2. Abra `test/http/auth.http`
3. Clique em "Send Request" acima de cada requisição
4. O token é salvo automaticamente entre requisições

---

## 📝 Estrutura dos Testes E2E

### Exemplo: auth.e2e-spec.ts

```typescript
describe('Auth (e2e)', () => {
  describe('POST /auth/register', () => {
    it('deve registrar novo usuário', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'senha123',
          displayName: 'Test',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.accessToken).toBeDefined();
        });
    });
  });
});
```

---

## 🔍 Fluxo de Testes

### Autenticação Completa

1. **Registrar** → Criar novo usuário
2. **Login** → Obter tokens
3. **Me** → Verificar autenticação
4. **Refresh** → Renovar tokens
5. **Logout** → Invalidar tokens

### Verificações

- ✅ Status codes corretos
- ✅ Estrutura de resposta
- ✅ Cookies HttpOnly
- ✅ Tokens válidos
- ✅ Validação de erros

---

## 💡 Dicas

### Testes HTTP

- Use variáveis para reutilizar tokens
- Organize por módulo (auth, users, etc.)
- Adicione comentários explicativos

### Scripts Bash

- Teste fluxos completos
- Verifique erros esperados
- Use cores para output legível

### Testes E2E

- Limpe banco após cada teste
- Use dados únicos (timestamp)
- Teste casos de erro também
