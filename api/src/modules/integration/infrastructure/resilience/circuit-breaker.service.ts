import { Injectable, Logger } from '@nestjs/common';
import { ProviderUnavailableError } from '../../domain/errors/integration.errors';

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

interface CircuitBreakerEntry {
  state: CircuitState;
  failures: number;
  successes: number;
  nextAttempt: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuits = new Map<string, CircuitBreakerEntry>();

  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    config: CircuitBreakerConfig = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000,
    },
  ): Promise<T> {
    let circuit = this.circuits.get(key);

    if (!circuit) {
      circuit = {
        state: CircuitState.CLOSED,
        failures: 0,
        successes: 0,
        nextAttempt: 0,
      };
      this.circuits.set(key, circuit);
    }

    // Check if circuit is open
    if (circuit.state === CircuitState.OPEN) {
      if (Date.now() < circuit.nextAttempt) {
        this.logger.warn({
          message: 'Circuit breaker is open',
          key,
          nextAttempt: new Date(circuit.nextAttempt).toISOString(),
        });
        throw new ProviderUnavailableError('Circuit breaker is open');
      }

      // Try to recover
      circuit.state = CircuitState.HALF_OPEN;
      circuit.successes = 0;
      this.logger.log({
        message: 'Circuit breaker entering half-open state',
        key,
      });
    }

    try {
      const result = await fn();

      // Success
      if (circuit.state === CircuitState.HALF_OPEN) {
        circuit.successes++;

        if (circuit.successes >= config.successThreshold) {
          circuit.state = CircuitState.CLOSED;
          circuit.failures = 0;
          circuit.successes = 0;
          this.logger.log({
            message: 'Circuit breaker closed',
            key,
          });
        }
      } else {
        circuit.failures = 0;
      }

      return result;
    } catch (error) {
      // Failure
      circuit.failures++;
      circuit.successes = 0;

      if (
        circuit.failures >= config.failureThreshold ||
        circuit.state === CircuitState.HALF_OPEN
      ) {
        circuit.state = CircuitState.OPEN;
        circuit.nextAttempt = Date.now() + config.timeout;
        this.logger.error({
          message: 'Circuit breaker opened',
          key,
          failures: circuit.failures,
          nextAttempt: new Date(circuit.nextAttempt).toISOString(),
        });
      }

      throw error;
    }
  }
}
