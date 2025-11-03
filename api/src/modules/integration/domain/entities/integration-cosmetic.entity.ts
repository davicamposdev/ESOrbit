import { CosmeticType } from '../enums/cosmetic-type.enum';
import { Rarity } from '../enums/rarity.enum';

export class IntegrationCosmetic {
  externalId: string;
  name: string;
  description: string;
  type: CosmeticType;
  rarity: Rarity;
  imageUrl: string;
  addedAt: string; // ISO 8601 UTC
  childrenExternalIds: string[];

  constructor(data: {
    externalId: string;
    name: string;
    description: string;
    type: CosmeticType;
    rarity: Rarity;
    imageUrl: string;
    addedAt: string;
    childrenExternalIds?: string[];
  }) {
    this.externalId = data.externalId;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.rarity = data.rarity;
    this.imageUrl = data.imageUrl;
    this.addedAt = data.addedAt;
    this.childrenExternalIds = data.childrenExternalIds || [];
  }
}
