import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtAccessStrategy } from './presentation/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './presentation/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

// Application
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';

// Infrastructure
import { UserRepository } from './infrastructure/repositories/prisma-user.repository';
import { TokenService } from './infrastructure/services/token.service';
import { PasswordHasher } from './infrastructure/services/password-hasher.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    // Repositories
    { provide: 'IUserRepository', useClass: UserRepository },
    UserRepository,

    // Services
    { provide: 'ITokenService', useClass: TokenService },
    { provide: 'IPasswordHasher', useClass: PasswordHasher },
    TokenService,
    PasswordHasher,

    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,

    // Strategies & Guards
    JwtAccessStrategy,
    JwtRefreshStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
