import { User } from '@/domain/entities/User';
import { Role } from '@/domain/entities/Role';
import { Permission } from '@/domain/entities/Permission';
import type { UserDTO, RoleDTO, PermissionDTO, UserListItemDTO } from '../dtos';

/**
 * Maps between User domain entity and DTOs
 */
export class UserMapper {
  /**
   * Map User entity to UserDTO
   */
  static toDTO(user: User): UserDTO {
    return {
      id: user.id.toValue(),
      email: user.email.value,
      name: user.name.value,
      roles: user.roles.map(RoleMapper.toDTO),
      permissions: user.permissions,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Map User entity to simplified list item DTO
   */
  static toListItemDTO(user: User): UserListItemDTO {
    return {
      id: user.id.toValue(),
      email: user.email.value,
      name: user.name.value,
      roles: user.roles.map((r) => r.name),
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

/**
 * Maps between Role domain entity and DTOs
 */
export class RoleMapper {
  /**
   * Map Role entity to RoleDTO
   */
  static toDTO(role: Role): RoleDTO {
    return {
      id: role.id.toValue(),
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(PermissionMapper.toDTO),
      isSystem: role.isSystem,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    };
  }
}

/**
 * Maps between Permission domain entity and DTOs
 */
export class PermissionMapper {
  /**
   * Map Permission entity to PermissionDTO
   */
  static toDTO(permission: Permission): PermissionDTO {
    return {
      id: permission.id.toValue(),
      name: permission.name,
      description: permission.description,
      group: permission.group,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
    };
  }
}
