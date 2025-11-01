# 🧪 Testes

## Estrutura de Testes

```
src/modules/auth/
├── application/
│   └── use-cases/
│       └── __tests__/
│           ├── register.use-case.spec.ts
│           ├── login.use-case.spec.ts
│           └── refresh-token.use-case.spec.ts
└── infrastructure/
    └── repositories/
        └── __tests__/
            └── user.repository.spec.ts
```

---

## Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Cobertura
npm run test:cov

# E2E
npm run test:e2e
```

---

## Exemplo de Teste de Use Case

```typescript
// register.use-case.spec.ts
import { Test } from '@nestjs/testing';
import { RegisterUseCase } from '../register.use-case';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>;
  let mockTokenService: jest.Mocked<ITokenService>;

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    mockPasswordHasher = {
      hash: jest.fn(),
    } as any;

    mockTokenService = {
      generateTokens: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: 'IPasswordHasher', useValue: mockPasswordHasher },
        { provide: 'ITokenService', useValue: mockTokenService },
      ],
    }).compile();

    useCase = module.get(RegisterUseCase);
  });

  it('deve registrar usuário com sucesso', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue('hashed');
    mockUserRepository.create.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      displayName: 'Test',
      credits: 10000,
    });
    mockTokenService.generateTokens.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    });

    const result = await useCase.execute({
      email: 'test@test.com',
      password: 'senha123',
      displayName: 'Test',
    });

    expect(result.user).toBeDefined();
    expect(result.tokens).toBeDefined();
  });

  it('deve lançar erro se email já existe', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({} as any);

    await expect(
      useCase.execute({
        email: 'test@test.com',
        password: 'senha123',
        displayName: 'Test',
      }),
    ).rejects.toThrow();
  });
});
```

---

## Testes E2E

```bash
# Executar testes E2E
npm run test:e2e
```

---

## Script de Teste Manual

Use o script bash para testes rápidos:

```bash
./test-auth.sh
```

Ou o arquivo `test-auth.http` no VS Code (extensão REST Client).
