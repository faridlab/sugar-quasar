/**
 * Result class for handling success/failure outcomes
 * Implements the Result pattern for functional error handling
 */
export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly error: string | undefined;
  private readonly _value: T | undefined;

  private constructor(isSuccess: boolean, error: string | undefined, value: T | undefined) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result must contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  /**
   * Get the value from a successful result
   * @throws Error if result is a failure
   */
  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cannot get value from a failed result. Error: ${this.error}`);
    }
    return this._value as T;
  }

  /**
   * Get the value or return a default if result is failure
   */
  public getValueOrDefault(defaultValue: T): T {
    if (this.isFailure) {
      return defaultValue;
    }
    return this._value as T;
  }

  /**
   * Create a successful result with a value
   */
  public static ok<U>(value: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  /**
   * Create a successful result without a value
   */
  public static okVoid(): Result<void> {
    return new Result<void>(true, undefined, undefined);
  }

  /**
   * Create a failed result with an error message
   */
  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error, undefined);
  }

  /**
   * Combine multiple results - fails if any result fails
   */
  public static combine(results: Result<unknown>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail(result.error!);
      }
    }
    return Result.okVoid();
  }

  /**
   * Combine multiple results and return all values
   */
  public static combineValues<T>(results: Result<T>[]): Result<T[]> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail(result.error!);
      }
      values.push(result.getValue());
    }
    return Result.ok(values);
  }

  /**
   * Map the value if successful
   */
  public map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure) {
      return Result.fail(this.error!);
    }
    return Result.ok(fn(this._value as T));
  }

  /**
   * FlatMap the value if successful
   */
  public flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isFailure) {
      return Result.fail(this.error!);
    }
    return fn(this._value as T);
  }
}
