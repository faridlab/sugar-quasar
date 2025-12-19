import { Entity } from './base/Entity';
import { UniqueEntityId } from '@/domain/core/UniqueEntityId';
import { Result } from '@/domain/core/Result';

interface PermissionProps {
  name: string;
  description: string;
  group: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePermissionProps {
  name: string;
  description?: string;
  group?: string;
}

/**
 * Permission Entity
 * Represents a permission that can be assigned to roles
 */
export class Permission extends Entity<PermissionProps> {
  private constructor(props: PermissionProps, id?: UniqueEntityId) {
    super(props, id);
  }

  /**
   * Factory method to create a Permission
   */
  static create(props: CreatePermissionProps, id?: UniqueEntityId): Result<Permission> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<Permission>('Permission name is required');
    }

    // Extract group from name if not provided (e.g., "users.create" -> "users")
    const group = props.group ?? props.name.split('.')[0] ?? 'general';

    const permission = new Permission(
      {
        name: props.name.toLowerCase().trim(),
        description: props.description ?? '',
        group: group.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );

    return Result.ok<Permission>(permission);
  }

  /**
   * Reconstruct from persistence
   */
  static fromPersistence(data: {
    id: string;
    name: string;
    description: string;
    group: string;
    createdAt: Date;
    updatedAt: Date;
  }): Permission {
    return new Permission(
      {
        name: data.name,
        description: data.description,
        group: data.group,
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

  get group(): string {
    return this.props.group;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Check if this permission matches a pattern
   * Supports wildcards like "users.*"
   */
  matches(pattern: string): boolean {
    if (pattern === '*') {
      return true;
    }

    if (pattern.endsWith('.*')) {
      const prefix = pattern.slice(0, -2);
      return this.props.name.startsWith(prefix + '.');
    }

    return this.props.name === pattern;
  }
}
