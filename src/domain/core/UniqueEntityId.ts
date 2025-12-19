/**
 * Value object representing a unique entity identifier
 */
export class UniqueEntityId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id ?? crypto.randomUUID();
  }

  /**
   * Get the string value of the ID
   */
  toString(): string {
    return this.value;
  }

  /**
   * Get the raw value
   */
  toValue(): string {
    return this.value;
  }

  /**
   * Check equality with another UniqueEntityId
   */
  equals(id?: UniqueEntityId): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof UniqueEntityId)) {
      return false;
    }
    return this.value === id.toValue();
  }
}
