import { Logger } from '@nestjs/common';
import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';
import { ExternalCosmeticDTO } from '../schemas/external-cosmetic.dto';
import { MetricsService } from '../observability/metrics.service';

export class CosmeticMapper {
  private static readonly logger = new Logger(CosmeticMapper.name);
  private static metricsService: MetricsService;

  static setMetricsService(metricsService: MetricsService): void {
    this.metricsService = metricsService;
  }

  static isValidCosmetic(external: unknown): external is ExternalCosmeticDTO {
    if (typeof external !== 'object' || external === null) {
      return false;
    }

    const item = external as Record<string, unknown>;
    const hasRequiredFields =
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.added === 'string';

    const hasValidType =
      typeof item.type === 'object' &&
      item.type !== null &&
      typeof (item.type as Record<string, unknown>).value === 'string';

    const hasValidRarity =
      typeof item.rarity === 'object' &&
      item.rarity !== null &&
      typeof (item.rarity as Record<string, unknown>).value === 'string';

    const hasImages = typeof item.images === 'object' && item.images !== null;

    return hasRequiredFields && hasValidType && hasValidRarity && hasImages;
  }

  static toIntegrationCosmetic(
    external: ExternalCosmeticDTO,
  ): IntegrationCosmetic {
    const type = this.normalizeValue(external.type.value);
    const rarity = this.normalizeValue(external.rarity.value);
    const imageUrl = this.selectBestImage(external.images);
    const addedAt = this.normalizeDate(external.added);
    const childrenExternalIds = this.extractChildren(external.set);

    return IntegrationCosmetic.create(
      external.id,
      external.name,
      external.description,
      type,
      rarity,
      imageUrl,
      addedAt,
      childrenExternalIds,
    );
  }

  private static normalizeValue(value: string): string {
    return value.toLowerCase().trim();
  }

  private static selectBestImage(
    images: ExternalCosmeticDTO['images'],
  ): string {
    if (images.featured) return images.featured;
    if (images.icon) return images.icon;
    if (images.smallIcon) return images.smallIcon;
    if (images.large) return images.large;
    if (images.small) return images.small;

    if (images.other) {
      const firstKey = Object.keys(images.other)[0];
      if (firstKey) return images.other[firstKey];
    }

    this.logger.warn({
      message: 'No valid image URL found',
      field: 'imageUrl',
      images,
    });

    return 'https://via.placeholder.com/512?text=No+Image';
  }

  private static normalizeDate(dateString: string): string {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      // Validate reasonable date range (2017-2100)
      const year = date.getFullYear();
      if (year < 2017 || year > 2100) {
        throw new Error('Date out of valid range');
      }

      return date.toISOString();
    } catch (error) {
      this.logger.error({
        message: 'Invalid date format',
        value: dateString,
        field: 'addedAt',
        error: error instanceof Error ? error.message : String(error),
      });

      // Fallback to current date
      return new Date().toISOString();
    }
  }

  private static extractChildren(set: ExternalCosmeticDTO['set']): string[] {
    if (!set || !set.items || !Array.isArray(set.items)) {
      return [];
    }

    return set.items.filter((id) => typeof id === 'string' && id.length > 0);
  }
}
