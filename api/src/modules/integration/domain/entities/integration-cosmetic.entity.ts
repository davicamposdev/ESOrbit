import { CosmeticType } from '../enums/cosmetic-type.enum';
import { Rarity } from '../enums/rarity.enum';

export class IntegrationCosmetic {
  private constructor(
    private readonly _externalId: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _type: CosmeticType,
    private readonly _rarity: Rarity,
    private readonly _imageUrl: string,
    private readonly _addedAt: string,
    private readonly _childrenExternalIds: string[],
  ) {}

  static create(
    externalId: string,
    name: string,
    description: string,
    type: CosmeticType,
    rarity: Rarity,
    imageUrl: string,
    addedAt: string,
    childrenExternalIds: string[],
  ): IntegrationCosmetic {
    return new IntegrationCosmetic(
      externalId,
      name,
      description,
      type,
      rarity,
      imageUrl,
      addedAt,
      childrenExternalIds,
    );
  }

  get externalId(): string {
    return this._externalId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get type(): CosmeticType {
    return this._type;
  }

  get rarity(): Rarity {
    return this._rarity;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get addedAt(): string {
    return this._addedAt;
  }

  get childrenExternalIds(): string[] {
    return this._childrenExternalIds;
  }
}
