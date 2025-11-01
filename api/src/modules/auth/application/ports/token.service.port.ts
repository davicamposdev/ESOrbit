import type { TokenPair } from '../../domain/interfaces/token.interface';
import type { AuthenticatedUser } from '../../domain/entities/user.entity';

export interface ITokenService {
  generateTokens(user: AuthenticatedUser): Promise<TokenPair>;
}
