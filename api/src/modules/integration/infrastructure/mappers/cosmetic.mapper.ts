import { Logger } from '@nestjs/common';
import { CosmeticType } from '../../domain/enums/cosmetic-type.enum';
import { Rarity } from '../../domain/enums/rarity.enum';
import { IntegrationCosmetic } from '../../domain/entities/integration-cosmetic.entity';
import { ExternalCosmeticDTO } from '../schemas/external-cosmetic.dto';
import { MetricsService } from '../observability/metrics.service';

export class CosmeticMapper {
  private static readonly logger = new Logger(CosmeticMapper.name);
  private static metricsService: MetricsService;

  static setMetricsService(metricsService: MetricsService): void {
    this.metricsService = metricsService;
  }

  private static readonly TYPE_MAP: Record<string, CosmeticType> = {
    outfit: CosmeticType.OUTFIT,
    backpack: CosmeticType.BACKPACK,
    'back bling': CosmeticType.BACKPACK,
    pickaxe: CosmeticType.PICKAXE,
    'harvesting tool': CosmeticType.PICKAXE,
    glider: CosmeticType.GLIDER,
    emote: CosmeticType.EMOTE,
    wrap: CosmeticType.WRAP,
    contrail: CosmeticType.CONTRAIL,
    'loading screen': CosmeticType.LOADING_SCREEN,
    loadingscreen: CosmeticType.LOADING_SCREEN,
    music: CosmeticType.MUSIC,
    banner: CosmeticType.BANNER,
    spray: CosmeticType.SPRAY,
    toy: CosmeticType.TOY,
    pet: CosmeticType.PET,
    bundle: CosmeticType.BUNDLE,
  };

  private static readonly RARITY_MAP: Record<string, Rarity> = {
    common: Rarity.COMMON,
    uncommon: Rarity.UNCOMMON,
    rare: Rarity.RARE,
    epic: Rarity.EPIC,
    legendary: Rarity.LEGENDARY,
    mythic: Rarity.MYTHIC,
    exotic: Rarity.EXOTIC,
    transcendent: Rarity.TRANSCENDENT,
    'gaming legends': Rarity.GAMINGLEGENDS,
    gaminglegends: Rarity.GAMINGLEGENDS,
    icon: Rarity.ICON,
    'icon series': Rarity.ICON,
    marvel: Rarity.MARVEL,
    dc: Rarity.DC,
    'star wars': Rarity.STARWARS,
    starwars: Rarity.STARWARS,
    shadow: Rarity.SHADOW,
    slurp: Rarity.SLURP,
    dark: Rarity.DARK,
    frozen: Rarity.FROZEN,
    lava: Rarity.LAVA,
  };

  static toIntegrationCosmetic(
    external: ExternalCosmeticDTO,
  ): IntegrationCosmetic {
    const type = this.mapType(external.type.value);
    const rarity = this.mapRarity(external.rarity.value);
    const imageUrl = this.selectBestImage(external.images);
    const addedAt = this.normalizeDate(external.added);
    const childrenExternalIds = this.extractChildren(external.set);

    return new IntegrationCosmetic({
      externalId: external.id,
      name: external.name,
      description: external.description,
      type,
      rarity,
      imageUrl,
      addedAt,
      childrenExternalIds,
    });
  }

  private static mapType(value: string): CosmeticType {
    const normalized = value.toLowerCase().trim();
    const mapped = this.TYPE_MAP[normalized];

    if (!mapped) {
      this.logger.warn({
        message: 'Unknown cosmetic type',
        value,
        field: 'type',
      });

      if (this.metricsService) {
        this.metricsService.incrementMapperUnknownValue('type', value);
      }

      return CosmeticType.UNKNOWN;
    }

    return mapped;
  }

  private static mapRarity(value: string): Rarity {
    const normalized = value.toLowerCase().trim();
    const mapped = this.RARITY_MAP[normalized];

    if (!mapped) {
      this.logger.warn({
        message: 'Unknown rarity value',
        value,
        field: 'rarity',
      });

      if (this.metricsService) {
        this.metricsService.incrementMapperUnknownValue('rarity', value);
      }

      return Rarity.UNKNOWN;
    }

    return mapped;
  }

  private static selectBestImage(
    images: ExternalCosmeticDTO['images'],
  ): string {
    // Priority: featured > icon > smallIcon > other
    if (images.featured) return images.featured;
    if (images.icon) return images.icon;
    if (images.smallIcon) return images.smallIcon;

    if (images.other) {
      const firstKey = Object.keys(images.other)[0];
      if (firstKey) return images.other[firstKey];
    }

    this.logger.warn({
      message: 'No valid image URL found',
      field: 'imageUrl',
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
