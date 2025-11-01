# ➕ Adicionar Funcionalidades

Guia para adicionar novas funcionalidades seguindo Clean Architecture.

---

## Exemplo: Reset de Senha

### 1. Domain (Interfaces)

```typescript
// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  // ... métodos existentes
  updatePassword(userId: string, hash: string): Promise<void>;
}
```

### 2. Infrastructure (Implementação)

```typescript
// infrastructure/repositories/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  // ... métodos existentes

  async updatePassword(userId: string, hash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });
  }
}
```

### 3. Application (Use Case)

```typescript
// application/use-cases/reset-password.use-case.ts
export interface ResetPasswordInput {
  userId: string;
  newPassword: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
    @Inject('IPasswordHasher') private readonly hasher: IPasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const hash = await this.hasher.hash(input.newPassword);
    await this.repo.updatePassword(input.userId, hash);
  }
}
```

### 4. Presentation (DTO)

```typescript
// presentation/dtos/reset-password.dto.ts
export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;
}
```

### 5. Presentation (Controller)

```typescript
// presentation/controllers/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(
    // ... outros use cases
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('reset-password')
  async resetPassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ResetPasswordDto,
  ) {
    await this.resetPasswordUseCase.execute({
      userId: user.id,
      newPassword: dto.newPassword,
    });
    return { ok: true };
  }
}
```

### 6. Module (Registrar)

```typescript
// auth.module.ts
@Module({
  // ...
  providers: [
    // ... providers existentes
    ResetPasswordUseCase, // ← Adicionar
  ],
})
export class AuthModule {}
```

---

## Checklist

- [ ] Interface no Domain
- [ ] Implementação na Infrastructure
- [ ] Use Case na Application
- [ ] DTO na Presentation (se necessário)
- [ ] Endpoint no Controller
- [ ] Registrar no Module
- [ ] Testes unitários
- [ ] Documentar endpoint

---

## Boas Práticas

### ✅ Fazer

- Um use case por funcionalidade
- Interfaces para dependências
- Validação nos DTOs
- Testes para cada camada
- Nomenclatura clara

### ❌ Evitar

- Lógica de negócio no controller
- Acesso direto ao Prisma nos use cases
- DTOs sem validação
- Use cases muito grandes
- Dependências circulares

---

## Novo Módulo

Para criar um novo módulo completo:

```bash
# Criar estrutura
mkdir -p src/modules/novo-modulo/{domain,application,infrastructure,presentation}
mkdir -p src/modules/novo-modulo/domain/{entities,repositories}
mkdir -p src/modules/novo-modulo/application/use-cases
mkdir -p src/modules/novo-modulo/infrastructure/repositories
mkdir -p src/modules/novo-modulo/presentation/{controllers,dtos}

# Criar module
touch src/modules/novo-modulo/novo-modulo.module.ts
```

Siga a mesma estrutura dos módulos `auth` e `users`.
