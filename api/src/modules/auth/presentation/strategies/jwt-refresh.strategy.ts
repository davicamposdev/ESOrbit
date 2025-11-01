import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { JwtPayload } from '../../domain/interfaces/token.interface';
import type { AuthenticatedUser } from '../../domain/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refresh_token,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      ignoreExpiration: false,
      algorithms: ['HS256'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<AuthenticatedUser> {
    if (!req?.cookies?.refresh_token) {
      throw new UnauthorizedException('Refresh token não fornecido');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return user;
  }
}
