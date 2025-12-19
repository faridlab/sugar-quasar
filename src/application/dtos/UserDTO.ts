/**
 * User Data Transfer Object
 * Used for transferring user data between layers
 */
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  roles: RoleDTO[];
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role Data Transfer Object
 */
export interface RoleDTO {
  id: string;
  name: string;
  description: string;
  permissions: PermissionDTO[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Permission Data Transfer Object
 */
export interface PermissionDTO {
  id: string;
  name: string;
  description: string;
  group: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User list item (simplified for lists)
 */
export interface UserListItemDTO {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
}

/**
 * Authenticated user response
 */
export interface AuthUserDTO {
  user: UserDTO;
  token: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * Login credentials
 */
export interface LoginCredentialsDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register data
 */
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

/**
 * Create user data
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  roleIds?: string[];
}

/**
 * Update user data
 */
export interface UpdateUserDTO {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  passwordConfirmation?: string | undefined;
  roleIds?: string[] | undefined;
  isActive?: boolean | undefined;
}
