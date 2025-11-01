import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import type { IPasswordHasher } from '../../application/ports/password-hasher.port';

@Injectable()
export class PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }
}
