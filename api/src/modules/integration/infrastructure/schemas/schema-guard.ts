import { Logger } from '@nestjs/common';
import { SchemaValidationError } from '../../domain/errors/integration.errors';
import {
  ExternalCosmeticsResponse,
  ExternalNewCosmeticsResponse,
  ExternalShopResponse,
} from './external-cosmetic.dto';

export class SchemaGuard {
  private static readonly logger = new Logger(SchemaGuard.name);

  static validateCosmeticsResponse(data: unknown): ExternalCosmeticsResponse {
    if (!this.isObject(data)) {
      throw new SchemaValidationError('Response is not an object');
    }

    if (typeof data.status !== 'number') {
      throw new SchemaValidationError('Missing or invalid status');
    }

    if (!this.isObject(data.data)) {
      throw new SchemaValidationError('Data is not an object');
    }

    const categoryKeys = Object.keys(data.data);
    if (categoryKeys.length === 0) {
      throw new SchemaValidationError('Data object is empty');
    }

    const firstCategoryKey = categoryKeys[0];
    const items = data.data[firstCategoryKey] as unknown;

    if (!Array.isArray(items)) {
      throw new SchemaValidationError(
        `Data.${firstCategoryKey} is not an array`,
      );
    }

    this.logger.log(
      `Response structure validated: ${items.length} items in category '${firstCategoryKey}'`,
    );

    return data as ExternalCosmeticsResponse;
  }

  static validateNewCosmeticsResponse(
    data: unknown,
  ): ExternalNewCosmeticsResponse {
    if (!this.isObject(data)) {
      throw new SchemaValidationError('Response is not an object');
    }

    if (typeof data.status !== 'number') {
      throw new SchemaValidationError('Missing or invalid status');
    }

    if (!this.isObject(data.data)) {
      throw new SchemaValidationError('Data is not an object');
    }

    if (!this.isObject(data.data.items)) {
      throw new SchemaValidationError('Data.items is not an object');
    }

    const itemsData = data.data.items as Record<string, unknown>;
    const categoryKeys = Object.keys(itemsData);

    if (categoryKeys.length === 0) {
      throw new SchemaValidationError('Data.items object is empty');
    }

    let totalItems = 0;
    for (const categoryKey of categoryKeys) {
      const items = itemsData[categoryKey];
      if (!Array.isArray(items)) {
        throw new SchemaValidationError(
          `Data.items.${categoryKey} is not an array`,
        );
      }
      totalItems += items.length;
    }

    this.logger.log(
      `Response structure validated: ${totalItems} total items across ${categoryKeys.length} categories`,
    );

    return data as ExternalNewCosmeticsResponse;
  }

  static validateShopResponse(data: unknown): ExternalShopResponse {
    if (!this.isObject(data)) {
      throw new SchemaValidationError('Response is not an object');
    }

    if (typeof data.status !== 'number') {
      throw new SchemaValidationError('Missing or invalid status');
    }

    if (!this.isObject(data.data)) {
      throw new SchemaValidationError('Data is not an object');
    }

    if (!Array.isArray(data.data.entries)) {
      throw new SchemaValidationError('Data.entries is not an array');
    }

    this.logger.log(
      `Shop response validated: ${data.data.entries.length} entries`,
    );

    return data as ExternalShopResponse;
  }

  private static isObject(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
