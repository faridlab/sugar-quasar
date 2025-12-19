/**
 * Base class for all domain errors
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message);
  }
}

/**
 * Error thrown when an entity is not found
 */
export class NotFoundError extends DomainError {
  constructor(
    public readonly entityName: string,
    public readonly id?: string
  ) {
    super(`${entityName}${id ? ` with id ${id}` : ''} not found`);
  }
}

/**
 * Error thrown when a conflict occurs (e.g., duplicate)
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when user is not authorized
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

/**
 * Error thrown when user doesn't have permission
 */
export class ForbiddenError extends DomainError {
  constructor(message: string = 'Forbidden') {
    super(message);
  }
}
