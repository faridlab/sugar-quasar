// DTOs
export type {
  UserDTO,
  RoleDTO,
  PermissionDTO,
  UserListItemDTO,
  AuthUserDTO,
  LoginCredentialsDTO,
  RegisterDTO,
} from './dtos';

// Mappers
export { UserMapper, RoleMapper, PermissionMapper } from './mappers';

// Ports
export type { IAuthService } from './ports/IAuthService';
export type { INotificationService } from './ports/INotificationService';
export type { IStorageService } from './ports/IStorageService';

// Auth Commands
export {
  loginCommandSchema,
  validateLoginCommand,
  type LoginCommand,
} from './commands/auth/LoginCommand';
export {
  registerCommandSchema,
  validateRegisterCommand,
  type RegisterCommand,
} from './commands/auth/RegisterCommand';
export { createLogoutCommand, type LogoutCommand } from './commands/auth/LogoutCommand';

// User Commands
export {
  createUserCommandSchema,
  validateCreateUserCommand,
  type CreateUserCommand,
} from './commands/users/CreateUserCommand';
export {
  updateUserCommandSchema,
  validateUpdateUserCommand,
  type UpdateUserCommand,
} from './commands/users/UpdateUserCommand';
export {
  deleteUserCommandSchema,
  validateDeleteUserCommand,
  type DeleteUserCommand,
} from './commands/users/DeleteUserCommand';

// Auth Queries
export {
  createGetCurrentUserQuery,
  type GetCurrentUserQuery,
} from './queries/auth/GetCurrentUserQuery';

// User Queries
export {
  listUsersQuerySchema,
  createListUsersQuery,
  type ListUsersQuery,
} from './queries/users/ListUsersQuery';
export {
  getUserByIdQuerySchema,
  createGetUserByIdQuery,
  type GetUserByIdQuery,
} from './queries/users/GetUserByIdQuery';

// Command Handlers
export { LoginHandler } from './handlers/commands/LoginHandler';
export { RegisterHandler } from './handlers/commands/RegisterHandler';
export { LogoutHandler } from './handlers/commands/LogoutHandler';

// Query Handlers
export { GetCurrentUserHandler } from './handlers/queries/GetCurrentUserHandler';
