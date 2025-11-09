import { CosmeticSetInfo } from '../value-objects/set-info.vo';

export class IntegrationCosmetic {
  private constructor(
    private readonly _externalId: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _type: string,
    private readonly _rarity: string,
    private readonly _imageUrl: string,
    private readonly _addedAt: string,
    private readonly _setInfo?: CosmeticSetInfo,
    private readonly _basePrice?: number,
    private readonly _currentPrice?: number,
  ) {}

  static create(
    externalId: string,
    name: string,
    description: string,
    type: string,
    rarity: string,
    imageUrl: string,
    addedAt: string,
    setInfo?: CosmeticSetInfo,
    basePrice?: number,
    currentPrice?: number,
  ): IntegrationCosmetic {
    return new IntegrationCosmetic(
      externalId,
      name,
      description,
      type,
      rarity,
      imageUrl,
      addedAt,
      setInfo,
      basePrice,
      currentPrice,
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

  get type(): string {
    return this._type;
  }

  get rarity(): string {
    return this._rarity;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get addedAt(): string {
    return this._addedAt;
  }

  get setInfo(): CosmeticSetInfo | undefined {
    return this._setInfo;
  }

  get basePrice(): number | undefined {
    return this._basePrice;
  }

  get currentPrice(): number | undefined {
    return this._currentPrice;
  }
}
