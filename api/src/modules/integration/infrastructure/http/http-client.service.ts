import { Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IntegrationConfigService } from '../config/integration-config.service';
import { MetricsService } from '../observability/metrics.service';
import {
  ProviderUnavailableError,
  ProviderTimeoutError,
  IntegrationError,
} from '../../domain/errors/integration.errors';

interface RequestMetrics {
  requestId: string;
  endpoint: string;
  method: string;
  startTime: number;
  attempts: number;
}

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private readonly client: AxiosInstance;
  private readonly metrics = new Map<string, RequestMetrics>();

  constructor(
    private readonly configService: IntegrationConfigService,
    private readonly metricsService: MetricsService,
  ) {
    const config = this.configService.get();

    this.client = axios.create({
      baseURL: config.fortniteApiBase,
      timeout: config.timeoutMs,
      headers: {
        'User-Agent': 'ESOrbit-Integration/1.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestId = uuidv4();
        config.headers['X-Request-ID'] = requestId;

        const metrics: RequestMetrics = {
          requestId,
          endpoint: config.url || '',
          method: config.method?.toUpperCase() || 'GET',
          startTime: Date.now(),
          attempts: 1,
        };

        this.metrics.set(requestId, metrics);

        this.logger.debug({
          message: 'Outgoing request',
          requestId,
          method: metrics.method,
          endpoint: metrics.endpoint,
        });

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestId = response.config.headers['X-Request-ID'] as string;
        const metrics = this.metrics.get(requestId);

        if (metrics) {
          const duration = Date.now() - metrics.startTime;

          this.logger.log({
            message: 'Request completed',
            requestId,
            endpoint: metrics.endpoint,
            status: response.status,
            duration,
            attempts: metrics.attempts,
          });

          this.metricsService.recordHttpDuration(metrics.endpoint, duration);
          this.metricsService.incrementHttpRequest(
            metrics.endpoint,
            response.status,
          );

          this.metrics.delete(requestId);
        }

        return response;
      },
      async (error: AxiosError) => {
        const requestId = error.config?.headers?.['X-Request-ID'] as string;
        const metrics = this.metrics.get(requestId);

        if (metrics) {
          const duration = Date.now() - metrics.startTime;
          const status = error.response?.status || 0;

          if (status === 503) {
            this.logger.debug({
              message: 'API externa indisponível (inicializando)',
              requestId,
              endpoint: metrics.endpoint,
              status,
              duration,
            });
          } else {
            this.logger.error({
              message: 'Request failed',
              requestId,
              endpoint: metrics.endpoint,
              status,
              duration,
              attempts: metrics.attempts,
              error: error.message,
            });
          }

          this.metricsService.recordHttpDuration(metrics.endpoint, duration);
          this.metricsService.incrementHttpRequest(metrics.endpoint, status);

          this.metrics.delete(requestId);
        }

        throw this.mapError(error);
      },
    );
  }

  private mapError(error: AxiosError): IntegrationError {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ProviderTimeoutError();
    }

    if (!error.response) {
      return new ProviderUnavailableError('Network error');
    }

    const status = error.response.status;
    const responseData = error.response.data as any;

    if (status === 503 && responseData?.error?.includes('booting up')) {
      return new ProviderUnavailableError(
        'API externa está inicializando. Aguarde alguns minutos.',
      );
    }

    if (status >= 500) {
      return new ProviderUnavailableError(
        `Provider error: ${error.response.statusText}`,
      );
    }

    if (status === 429) {
      return new ProviderUnavailableError('Rate limit exceeded');
    }

    if (status >= 400) {
      return new IntegrationError(
        `Client error: ${error.response.statusText}`,
        'CLIENT_ERROR',
      );
    }

    return new IntegrationError('Unknown error', 'UNKNOWN_ERROR');
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig & { retries?: number },
  ): Promise<T> {
    const appConfig = this.configService.get();
    const maxRetries = config?.retries ?? appConfig.retryAttempts;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.get<T>(url, config);
        return response.data;
      } catch (error) {
        const errorObj = error as any;
        const isAxiosError = errorObj?.isAxiosError === true;
        const status = errorObj?.response?.status;
        const responseData = errorObj?.response?.data;

        const isBootingUp =
          status === 503 &&
          (responseData?.error?.includes('booting up') ||
            responseData?.message?.includes('booting up'));

        if (isBootingUp && attempt >= 1) {
          this.logger.warn(
            '⚠️  API externa está inicializando. A sincronização será executada mais tarde.',
          );
          throw error;
        }

        if (isAxiosError && status >= 500 && status < 600 && attempt >= 2) {
          this.logger.warn(
            'API externa com problemas. Encerrando tentativas de conexão.',
          );
          throw error;
        }

        if (attempt === maxRetries) {
          throw error;
        }

        const requestId =
          error instanceof Error && 'config' in error
            ? (error as any).config?.headers?.['X-Request-ID']
            : undefined;

        if (requestId) {
          const metrics = this.metrics.get(requestId);
          if (metrics) {
            metrics.attempts = attempt + 2;
          }
        }

        const backoffMultiplier = isBootingUp ? 1 : Math.pow(2, attempt);
        const backoff = appConfig.retryBackoffMs * backoffMultiplier;

        this.logger.warn({
          message: 'Retrying request',
          attempt: attempt + 1,
          maxRetries,
          backoffMs: backoff,
        });

        await this.sleep(backoff);
      }
    }

    throw new ProviderUnavailableError('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
