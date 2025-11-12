export class Cosmetic {
  private constructor(
    private _id: string | undefined,
    private readonly _externalId: string,
    private readonly _name: string,
    private readonly _type: string,
    private readonly _rarity: string,
    private readonly _imageUrl: string,
    private readonly _addedAt: Date,
    private readonly _isNew: boolean,
    private readonly _isAvailable: boolean,
    private readonly _basePrice: number | null,
    private readonly _currentPrice: number | null,
    private readonly _onSale: boolean,
    private readonly _isBundle: boolean,
    private readonly _childrenExternalIds: string[],
  ) {}

  static create(
    externalId: string,
    name: string,
    type: string,
    rarity: string,
    imageUrl: string,
    addedAt: Date,
    isNew: boolean = false,
    isAvailable: boolean = false,
    basePrice: number | null = null,
    currentPrice: number | null = null,
    onSale: boolean = false,
    isBundle: boolean = false,
    childrenExternalIds: string[] = [],
  ): Cosmetic {
    return new Cosmetic(
      undefined,
      externalId,
      name,
      type,
      rarity,
      imageUrl,
      addedAt,
      isNew,
      isAvailable,
      basePrice,
      currentPrice,
      onSale,
      isBundle,
      childrenExternalIds,
    );
  }

  static restore(
    id: string,
    externalId: string,
    name: string,
    type: string,
    rarity: string,
    imageUrl: string,
    addedAt: Date,
    isNew: boolean,
    isAvailable: boolean,
    basePrice: number | null,
    currentPrice: number | null,
    onSale: boolean,
    isBundle: boolean,
    childrenExternalIds: string[] = [],
  ): Cosmetic {
    return new Cosmetic(
      id,
      externalId,
      name,
      type,
      rarity,
      imageUrl,
      addedAt,
      isNew,
      isAvailable,
      basePrice,
      currentPrice,
      onSale,
      isBundle,
      childrenExternalIds,
    );
  }

  get id(): string {
    if (!this._id) {
      throw new Error('Cosmetic ainda não foi persistido');
    }
    return this._id as string;
  }

  get isPersisted(): boolean {
    return this._id !== undefined;
  }

  get externalId(): string {
    return this._externalId;
  }

  get name(): string {
    return this._name;
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

  get addedAt(): Date {
    return this._addedAt;
  }

  get isNew(): boolean {
    return this._isNew;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get basePrice(): number | null {
    return this._basePrice;
  }

  get currentPrice(): number | null {
    return this._currentPrice;
  }

  get onSale(): boolean {
    return this._onSale;
  }

  get isBundle(): boolean {
    return this._isBundle;
  }

  get childrenExternalIds(): string[] {
    return this._childrenExternalIds;
  }
}
