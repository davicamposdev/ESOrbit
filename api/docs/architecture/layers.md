# 📚 Camadas e Responsabilidades

## 🔵 Domain (Domínio)

**O que é:** Regras de negócio puras

**Contém:**

- Entities (entidades)
- Interfaces de repositórios
- Interfaces de serviços
- Tipos de dados

**Características:**

- ✅ Não depende de nada
- ✅ Apenas TypeScript puro
- ❌ Sem Prisma, NestJS, etc.

**Exemplo:**

```typescript
export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  credits: number;
}
```

---

## 🟢 Application (Aplicação)

**O que é:** Casos de uso da aplicação

**Contém:**

- Use Cases (um por funcionalidade)

**Características:**

- ✅ Depende apenas de Domain
- ✅ Orquestra repositórios e serviços
- ❌ Não conhece HTTP ou banco de dados

**Exemplo:**

```typescript
@Injectable()
export class RegisterUseCase {
  async execute(input: RegisterInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new ConflictException();

    const hash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({ ...input, hash });
    const tokens = await this.tokenService.generateTokens(user);

    return { user, tokens };
  }
}
```

---

## 🟡 Infrastructure (Infraestrutura)

**O que é:** Implementações técnicas

**Contém:**

- Repositórios (Prisma)
- Serviços (JWT, Argon2)

**Características:**

- ✅ Implementa interfaces do Domain
- ✅ Lida com tecnologias específicas
- ❌ Sem lógica de negócio

**Exemplo:**

```typescript
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

---

## 🟠 Presentation (Apresentação)

**O que é:** Interface com o mundo externo

**Contém:**

- Controllers
- DTOs
- Guards
- Strategies
- Decorators

**Características:**

- ✅ Lida com HTTP
- ✅ Valida entrada
- ✅ Delega para use cases
- ❌ Sem lógica de negócio

**Exemplo:**

```typescript
@Controller('auth')
export class AuthController {
  constructor(private registerUseCase: RegisterUseCase) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }
}
```

---

## Fluxo de uma Requisição

```
1. HTTP Request
   ↓
2. Controller (Presentation)
   ↓
3. Use Case (Application)
   ↓
4. Repository/Service (Infrastructure)
   ↓
5. Database/External Service
   ↓
6. Response
```
