export class AuthenticatedUser {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _username: string,
    private readonly _credits: number,
  ) {}

  static create(
    id: string,
    email: string,
    username: string,
    credits: number,
  ): AuthenticatedUser {
    return new AuthenticatedUser(id, email, username, credits);
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
}
