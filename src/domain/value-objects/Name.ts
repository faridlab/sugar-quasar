import { ValueObject } from '@/domain/entities/base/ValueObject';
import { Result } from '@/domain/core/Result';

interface NameProps {
  value: string;
}

/**
 * Name Value Object
 * Encapsulates name validation and formatting
 */
export class Name extends ValueObject<NameProps> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(props: NameProps) {
    super(props);
  }

  /**
   * Factory method to create a validated Name
   */
  static create(name: string): Result<Name> {
    if (!name || name.trim().length === 0) {
      return Result.fail<Name>('Name cannot be empty');
    }

    const trimmed = name.trim();

    if (trimmed.length < this.MIN_LENGTH) {
      return Result.fail<Name>(`Name must be at least ${this.MIN_LENGTH} characters`);
    }

    if (trimmed.length > this.MAX_LENGTH) {
      return Result.fail<Name>(`Name cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return Result.ok<Name>(new Name({ value: trimmed }));
  }

  /**
   * Get the name value
   */
  get value(): string {
    return this.props.value;
  }

  /**
   * Get initials from the name
   */
  get initials(): string {
    return this.props.value
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  toString(): string {
    return this.props.value;
  }
}
