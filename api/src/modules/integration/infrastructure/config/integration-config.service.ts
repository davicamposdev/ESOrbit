import { Injectable } from '@nestjs/common';

export interface IntegrationConfig {
  fortniteApiBase: string;
  timeoutMs: number;
  retryAttempts: number;
  retryBackoffMs: number;
  rateLimitRps: number;
}

@Injectable()
export class IntegrationConfigService {
  private readonly config: IntegrationConfig;

  constructor() {
    this.config = this.loadAndValidate();
  }

  private loadAndValidate(): IntegrationConfig {
    const config: IntegrationConfig = {
      fortniteApiBase:
        process.env.FORTNITE_API_BASE || 'https://fortnite-api.com/v2',
      timeoutMs: parseInt(process.env.TIMEOUT_MS || '10000', 10),
      retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3', 10),
      retryBackoffMs: parseInt(process.env.RETRY_BACKOFF_MS || '1000', 10),
      rateLimitRps: parseInt(process.env.RATE_LIMIT_RPS || '5', 10),
    };

    this.validate(config);
    return config;
  }

  private validate(config: IntegrationConfig): void {
    if (!config.fortniteApiBase) {
      throw new Error('FORTNITE_API_BASE is required');
    }

    if (config.timeoutMs <= 0) {
      throw new Error('TIMEOUT_MS must be positive');
    }

    if (config.retryAttempts < 0) {
      throw new Error('RETRY_ATTEMPTS must be non-negative');
    }

    if (config.retryBackoffMs <= 0) {
      throw new Error('RETRY_BACKOFF_MS must be positive');
    }

    if (config.rateLimitRps <= 0) {
      throw new Error('RATE_LIMIT_RPS must be positive');
    }
  }

  get(): IntegrationConfig {
    return { ...this.config };
  }
}
