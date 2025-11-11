import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { IPasswordHasher } from '../ports/password-hasher.port';
import type { ITokenService } from '../ports/token.service.port';
import type { AuthenticatedUser } from '../../domain/entities/user.entity';
import type { TokenPair } from '../../domain/interfaces/token.interface';

export interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher') private readonly passwordHasher: IPasswordHasher,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(
    input: RegisterInput,
  ): Promise<{ user: AuthenticatedUser; tokens: TokenPair }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new ConflictException('Email já cadastrado');

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      username: input.username,
    });

    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }
}
