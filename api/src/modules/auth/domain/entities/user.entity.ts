export class AuthenticatedUser {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _displayName: string,
    private readonly _credits: number,
  ) {}

  static create(
    id: string,
    email: string,
    displayName: string,
    credits: number,
  ): AuthenticatedUser {
    return new AuthenticatedUser(id, email, displayName, credits);
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get displayName(): string {
    return this._displayName;
  }

  get credits(): number {
    return this._credits;
  }
}
