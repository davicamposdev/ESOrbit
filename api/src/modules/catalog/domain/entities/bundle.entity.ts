export class Bundle {
  private constructor(
    private _id: string | undefined,
    private readonly _externalId: string,
    private readonly _name: string,
  ) {}

  static create(externalId: string, name: string): Bundle {
    return new Bundle(undefined, externalId, name);
  }

  static restore(id: string, externalId: string, name: string): Bundle {
    return new Bundle(id, externalId, name);
  }

  setId(id: string): void {
    if (this._id) {
      throw new Error('Bundle ID já foi definido');
    }
    this._id = id;
  }

  get id(): string {
    if (!this._id) {
      throw new Error('Bundle ainda não foi persistido');
    }
    return this._id;
  }

  get externalId(): string {
    return this._externalId;
  }

  get name(): string {
    return this._name;
  }

  get isPersisted(): boolean {
    return this._id !== undefined;
  }
}
