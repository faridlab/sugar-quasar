// Core
export { Result } from './core/Result';
export { UniqueEntityId } from './core/UniqueEntityId';

// Entities
export { Entity, ValueObject } from './entities/base';
export { User, type CreateUserProps } from './entities/User';
export { Role, type CreateRoleProps } from './entities/Role';
export { Permission, type CreatePermissionProps } from './entities/Permission';

// Value Objects
export { Email } from './value-objects/Email';
export { Name } from './value-objects/Name';

// Repositories
export type {
  IBaseRepository,
  PaginationParams,
  PaginatedResult,
} from './repositories/IBaseRepository';
export type { IUserRepository } from './repositories/IUserRepository';
export type { IRoleRepository } from './repositories/IRoleRepository';
export type { IPermissionRepository } from './repositories/IPermissionRepository';

// Errors
export {
  DomainError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from './errors';
