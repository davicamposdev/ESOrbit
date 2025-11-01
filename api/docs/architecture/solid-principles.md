# 🎯 Princípios SOLID

## S - Single Responsibility

**Uma classe, uma responsabilidade**

✅ **Correto:**

```typescript
class RegisterUseCase {
  execute() {
    /* apenas registra */
  }
}

class LoginUseCase {
  execute() {
    /* apenas faz login */
  }
}
```

❌ **Errado:**

```typescript
class AuthService {
  register() {}
  login() {}
  refresh() {}
  logout() {}
  resetPassword() {}
}
```

---

## O - Open/Closed

**Aberto para extensão, fechado para modificação**

✅ **Correto:**

```typescript
// Adicionar nova estratégia sem modificar código existente
class GoogleOAuthStrategy extends PassportStrategy {}
class GitHubOAuthStrategy extends PassportStrategy {}
```

---

## L - Liskov Substitution

**Implementações podem ser substituídas**

✅ **Correto:**

```typescript
// Posso trocar implementação sem quebrar código
class UserRepository implements IUserRepository {}
class InMemoryUserRepository implements IUserRepository {}
```

---

## I - Interface Segregation

**Interfaces pequenas e específicas**

✅ **Correto:**

```typescript
interface IUserRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
}

interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}
```

❌ **Errado:**

```typescript
interface IUserService {
  findById(): void;
  create(): void;
  update(): void;
  delete(): void;
  hashPassword(): void;
  verifyPassword(): void;
  generateToken(): void;
}
```

---

## D - Dependency Inversion

**Dependa de abstrações, não implementações**

✅ **Correto:**

```typescript
class RegisterUseCase {
  constructor(@Inject('IUserRepository') private repo: IUserRepository) {}
}
```

❌ **Errado:**

```typescript
class RegisterUseCase {
  constructor(private prisma: PrismaService) {}
}
```

---

## Benefícios no Projeto

- **Testabilidade:** Fácil mockar interfaces
- **Manutenibilidade:** Mudanças isoladas
- **Flexibilidade:** Trocar implementações facilmente
- **Clareza:** Responsabilidades bem definidas
