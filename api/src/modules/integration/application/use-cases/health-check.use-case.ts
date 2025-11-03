import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICosmeticsReadPort } from '../ports/cosmetics-read.port';

@Injectable()
export class HealthCheckUseCase {
  private readonly logger = new Logger(HealthCheckUseCase.name);

  constructor(
    @Inject('ICosmeticsReadPort')
    private readonly cosmeticsPort: ICosmeticsReadPort,
  ) {}

  async execute(): Promise<{ latency: number; status: string }> {
    this.logger.log('Performing health check');

    const result = await this.cosmeticsPort.pingCosmetics();

    this.logger.log({
      message: 'Health check completed',
      latency: result.latency,
      status: result.status,
    });

    return result;
  }
}
