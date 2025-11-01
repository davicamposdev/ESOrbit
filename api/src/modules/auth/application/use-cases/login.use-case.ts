import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { IPasswordHasher } from '../ports/password-hasher.port';
import type { ITokenService } from '../ports/token.service.port';
import { AuthenticatedUser } from '../../domain/entities/user.entity';
import type { TokenPair } from '../../domain/interfaces/token.interface';
import { UserRepository } from '../../infrastructure/repositories/prisma-user.repository';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(
    input: LoginInput,
  ): Promise<{ user: AuthenticatedUser; tokens: TokenPair }> {
    const user = await this.userRepository.findByEmailWithPassword(input.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isValid = await this.passwordHasher.verify(
      user.passwordHash,
      input.password,
    );
    if (!isValid) throw new UnauthorizedException('Credenciais inválidas');

    const authenticatedUser = AuthenticatedUser.create(
      user.id,
      user.email,
      user.displayName,
      user.credits,
    );

    const tokens = await this.tokenService.generateTokens(authenticatedUser);
    return { user: authenticatedUser, tokens };
  }
}
