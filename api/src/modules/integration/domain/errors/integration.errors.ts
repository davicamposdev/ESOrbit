export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'IntegrationError';
  }
}

export class ProviderUnavailableError extends IntegrationError {
  constructor(message = 'Provider temporarily unavailable') {
    super(message, 'PROVIDER_UNAVAILABLE');
    this.name = 'ProviderUnavailableError';
  }
}

export class ProviderTimeoutError extends IntegrationError {
  constructor(message = 'Provider request timeout') {
    super(message, 'PROVIDER_TIMEOUT');
    this.name = 'ProviderTimeoutError';
  }
}

export class SchemaValidationError extends IntegrationError {
  constructor(message = 'Schema validation failed') {
    super(message, 'SCHEMA_VALIDATION_ERROR');
    this.name = 'SchemaValidationError';
  }
}

export class RateLimitError extends IntegrationError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}
