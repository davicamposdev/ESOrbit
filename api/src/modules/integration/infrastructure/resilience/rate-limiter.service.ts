import { Injectable, Logger } from '@nestjs/common';
import { RateLimitError } from '../../domain/errors/integration.errors';

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private readonly buckets = new Map<string, RateLimitEntry>();

  async acquire(
    key: string,
    maxTokens: number,
    refillRate: number,
  ): Promise<void> {
    const now = Date.now();
    let entry = this.buckets.get(key);

    if (!entry) {
      entry = { tokens: maxTokens, lastRefill: now };
      this.buckets.set(key, entry);
    }

    // Refill tokens based on time elapsed
    const elapsed = now - entry.lastRefill;
    const tokensToAdd = Math.floor((elapsed / 1000) * refillRate);

    if (tokensToAdd > 0) {
      entry.tokens = Math.min(maxTokens, entry.tokens + tokensToAdd);
      entry.lastRefill = now;
    }

    if (entry.tokens < 1) {
      const waitTime = Math.ceil(((1 - entry.tokens) / refillRate) * 1000);
      this.logger.warn({
        message: 'Rate limit reached',
        key,
        waitTime,
      });
      throw new RateLimitError(
        `Rate limit exceeded. Retry after ${waitTime}ms`,
      );
    }

    entry.tokens -= 1;
  }
}
