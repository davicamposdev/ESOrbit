export class AuthenticatedUser {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _username: string,
    private readonly _credits: number,
    private readonly _createdAt?: Date,
  ) {}

  static create(
    id: string,
    email: string,
    username: string,
    credits: number,
    createdAt?: Date,
  ): AuthenticatedUser {
    return new AuthenticatedUser(id, email, username, credits, createdAt);
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get username(): string {
    return this._username;
  }

  get credits(): number {
    return this._credits;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      username: this._username,
      credits: this._credits,
      createdAt: this._createdAt,
    };
  }
}
