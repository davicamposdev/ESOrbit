import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { ITokenService } from '../ports/token.service.port';
import type { AuthenticatedUser } from '../../domain/entities/user.entity';
import type { TokenPair } from '../../domain/interfaces/token.interface';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  async execute(user: AuthenticatedUser): Promise<TokenPair> {
    const currentUser = await this.userRepository.findById(user.id);
    if (!currentUser) throw new UnauthorizedException('Usuário não encontrado');

    return this.tokenService.generateTokens(currentUser);
  }
}
