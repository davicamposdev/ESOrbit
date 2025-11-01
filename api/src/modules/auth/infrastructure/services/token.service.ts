import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import type { ITokenService } from '../../application/ports/token.service.port';
import type { TokenPair } from '../../domain/interfaces/token.interface';
import type { AuthenticatedUser } from '../../domain/entities/user.entity';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(user: AuthenticatedUser): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, jti: randomUUID() };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
