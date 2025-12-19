import { Entity } from './base/Entity';
import { UniqueEntityId } from '@/domain/core/UniqueEntityId';
import { Result } from '@/domain/core/Result';
import { Permission } from './Permission';

interface RoleProps {
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleProps {
  name: string;
  description?: string;
  permissions?: Permission[];
  isSystem?: boolean;
}

/**
 * Role Entity
 * Represents a role that groups permissions
 */
export class Role extends Entity<RoleProps> {
  private constructor(props: RoleProps, id?: UniqueEntityId) {
    super(props, id);
  }

  /**
   * Factory method to create a Role
   */
  static create(props: CreateRoleProps, id?: UniqueEntityId): Result<Role> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<Role>('Role name is required');
    }

    if (props.name.trim().length < 2) {
      return Result.fail<Role>('Role name must be at least 2 characters');
    }

    const role = new Role(
      {
        name: props.name.trim(),
        description: props.description ?? '',
        permissions: props.permissions ?? [],
        isSystem: props.isSystem ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );

    return Result.ok<Role>(role);
  }

  /**
   * Reconstruct from persistence
   */
  static fromPersistence(data: {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Role {
    return new Role(
      {
        name: data.name,
        description: data.description,
        permissions: data.permissions,
        isSystem: data.isSystem,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get permissions(): Permission[] {
    return [...this.props.permissions];
  }

  get isSystem(): boolean {
    return this.props.isSystem;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Check if role has a specific permission
   */
  hasPermission(permissionName: string): boolean {
    return this.props.permissions.some((p) => p.matches(permissionName) || p.name === '*');
  }

  /**
   * Add a permission to the role
   */
  addPermission(permission: Permission): void {
    const exists = this.props.permissions.some((p) => p.equals(permission));
    if (!exists) {
      this.props.permissions.push(permission);
      this.props.updatedAt = new Date();
    }
  }

  /**
   * Remove a permission from the role
   */
  removePermission(permission: Permission): void {
    const index = this.props.permissions.findIndex((p) => p.equals(permission));
    if (index > -1) {
      this.props.permissions.splice(index, 1);
      this.props.updatedAt = new Date();
    }
  }

  /**
   * Update role details
   */
  update(props: { name?: string; description?: string }): Result<void> {
    if (props.name !== undefined) {
      if (props.name.trim().length < 2) {
        return Result.fail('Role name must be at least 2 characters');
      }
      this.props.name = props.name.trim();
    }

    if (props.description !== undefined) {
      this.props.description = props.description;
    }

    this.props.updatedAt = new Date();
    return Result.okVoid();
  }
}
