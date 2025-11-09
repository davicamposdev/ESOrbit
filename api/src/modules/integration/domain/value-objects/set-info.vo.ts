import { isNotEmpty } from 'class-validator';

export class CosmeticSetInfo {
  private constructor(
    private readonly _value: string,
    private readonly _text: string,
    private readonly _backendValue: string,
  ) {}

  static create(
    value: string,
    text: string,
    backendValue: string,
  ): CosmeticSetInfo {
    if (!value?.trim()) {
      throw new Error('CosmeticSetInfo: value cannot be empty');
    }
    if (!text?.trim()) {
      throw new Error('CosmeticSetInfo: text cannot be empty');
    }
    if (!backendValue?.trim()) {
      throw new Error('CosmeticSetInfo: backendValue cannot be empty');
    }

    return new CosmeticSetInfo(value.trim(), text.trim(), backendValue.trim());
  }

  get value(): string {
    return this._value;
  }

  get text(): string {
    return this._text;
  }

  get backendValue(): string {
    return this._backendValue;
  }

  equals(other: CosmeticSetInfo | undefined): boolean {
    if (!other) return false;
    return (
      this._value === other._value &&
      this._text === other._text &&
      this._backendValue === other._backendValue
    );
  }
}
