import { ValueObject } from '@/domain/entities/base/ValueObject';
import { Result } from '@/domain/core/Result';

interface EmailProps {
  value: string;
}

/**
 * Email Value Object
 * Encapsulates email validation and formatting
 */
export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  /**
   * Factory method to create a validated Email
   */
  static create(email: string): Result<Email> {
    if (!email || email.trim().length === 0) {
      return Result.fail<Email>('Email cannot be empty');
    }

    const trimmed = email.trim().toLowerCase();

    if (!this.EMAIL_REGEX.test(trimmed)) {
      return Result.fail<Email>('Invalid email format');
    }

    return Result.ok<Email>(new Email({ value: trimmed }));
  }

  /**
   * Get the email value
   */
  get value(): string {
    return this.props.value;
  }

  /**
   * Get the domain part of the email
   */
  get domain(): string {
    return this.props.value.split('@')[1] ?? '';
  }

  /**
   * Get the local part of the email (before @)
   */
  get localPart(): string {
    return this.props.value.split('@')[0] ?? '';
  }

  toString(): string {
    return this.props.value;
  }
}
