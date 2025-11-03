import { Logger } from '@nestjs/common';
import { SchemaValidationError } from '../../domain/errors/integration.errors';
import {
  ExternalCosmeticsResponse,
  ExternalNewCosmeticsResponse,
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

    const languageKeys = Object.keys(data.data);
    if (languageKeys.length === 0) {
      throw new SchemaValidationError('Data object is empty');
    }

    const firstLanguageKey = languageKeys[0];
    const items = data.data[firstLanguageKey];

    if (!Array.isArray(items)) {
      throw new SchemaValidationError(
        `Data.${firstLanguageKey} is not an array`,
      );
    }

    const sampleSize = Math.min(5, items.length);
    for (let i = 0; i < sampleSize; i++) {
      this.validateCosmetic(items[i], `data.${firstLanguageKey}[${i}]`);
    }

    this.logger.log(
      `Schema validation passed for ${sampleSize} sample items out of ${items.length} total items`,
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

    if (!Array.isArray(data.data.items)) {
      throw new SchemaValidationError('Data.items is not an array');
    }

    const sampleSize = Math.min(5, data.data.items.length);
    for (let i = 0; i < sampleSize; i++) {
      this.validateCosmetic(data.data.items[i], `data.items[${i}]`);
    }

    this.logger.log(
      `Schema validation passed for ${sampleSize} sample items out of ${data.data.items.length} total items`,
    );

    return data as ExternalNewCosmeticsResponse;
  }

  private static validateCosmetic(item: unknown, path: string): void {
    if (!this.isObject(item)) {
      throw new SchemaValidationError(`${path} is not an object`);
    }

    if (typeof item.id !== 'string' || !item.id) {
      throw new SchemaValidationError(`${path}.id is missing or invalid`);
    }

    if (typeof item.name !== 'string') {
      throw new SchemaValidationError(`${path}.name is missing or invalid`);
    }

    if (typeof item.description !== 'string') {
      throw new SchemaValidationError(
        `${path}.description is missing or invalid`,
      );
    }

    if (!this.isObject(item.type) || typeof item.type.value !== 'string') {
      throw new SchemaValidationError(
        `${path}.type.value is missing or invalid`,
      );
    }

    if (
      item.type.displayValue !== undefined &&
      typeof item.type.displayValue !== 'string'
    ) {
      throw new SchemaValidationError(`${path}.type.displayValue is invalid`);
    }

    if (
      item.type.backendValue !== undefined &&
      typeof item.type.backendValue !== 'string'
    ) {
      throw new SchemaValidationError(`${path}.type.backendValue is invalid`);
    }

    if (!this.isObject(item.rarity) || typeof item.rarity.value !== 'string') {
      throw new SchemaValidationError(
        `${path}.rarity.value is missing or invalid`,
      );
    }

    if (
      item.rarity.displayValue !== undefined &&
      typeof item.rarity.displayValue !== 'string'
    ) {
      throw new SchemaValidationError(`${path}.rarity.displayValue is invalid`);
    }

    if (
      item.rarity.backendValue !== undefined &&
      typeof item.rarity.backendValue !== 'string'
    ) {
      throw new SchemaValidationError(`${path}.rarity.backendValue is invalid`);
    }

    if (!this.isObject(item.images)) {
      throw new SchemaValidationError(`${path}.images is missing or invalid`);
    }

    if (typeof item.images.smallIcon !== 'string') {
      throw new SchemaValidationError(
        `${path}.images.smallIcon is missing or invalid`,
      );
    }

    if (
      item.images.icon !== undefined &&
      typeof item.images.icon !== 'string'
    ) {
      throw new SchemaValidationError(`${path}.images.icon is invalid`);
    }

    if (typeof item.added !== 'string') {
      throw new SchemaValidationError(`${path}.added is missing or invalid`);
    }

    if (item.set !== undefined) {
      if (!this.isObject(item.set)) {
        throw new SchemaValidationError(`${path}.set is invalid`);
      }
      if (typeof item.set.value !== 'string') {
        throw new SchemaValidationError(`${path}.set.value is invalid`);
      }
    }

    if (item.series !== undefined) {
      if (!this.isObject(item.series)) {
        throw new SchemaValidationError(`${path}.series is invalid`);
      }
      if (typeof item.series.value !== 'string') {
        throw new SchemaValidationError(`${path}.series.value is invalid`);
      }
    }

    if (item.introduction !== undefined) {
      if (!this.isObject(item.introduction)) {
        throw new SchemaValidationError(`${path}.introduction is invalid`);
      }
    }

    if (item.metaTags !== undefined && !Array.isArray(item.metaTags)) {
      throw new SchemaValidationError(`${path}.metaTags is invalid`);
    }
  }

  private static isObject(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
