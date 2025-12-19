import { Entity } from './base/Entity';
import { UniqueEntityId } from '@/domain/core/UniqueEntityId';
import { Result } from '@/domain/core/Result';
import { Email } from '@/domain/value-objects/Email';
import { Name } from '@/domain/value-objects/Name';
import { Role } from './Role';

interface UserProps {
  email: Email;
  name: Name;
  roles: Role[];
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  email: string;
  name: string;
  roles?: Role[];
}

/**
 * User Entity (Aggregate Root)
 * Core entity representing a system user
 */
export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  /**
   * Factory method to create a User
   */
  static create(props: CreateUserProps, id?: UniqueEntityId): Result<User> {
    const emailResult = Email.create(props.email);
    if (emailResult.isFailure) {
      return Result.fail<User>(emailResult.error!);
    }

    const nameResult = Name.create(props.name);
    if (nameResult.isFailure) {
      return Result.fail<User>(nameResult.error!);
    }

    const user = new User(
      {
        email: emailResult.getValue(),
        name: nameResult.getValue(),
        roles: props.roles ?? [],
        isActive: true,
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );

    return Result.ok<User>(user);
  }

  /**
   * Reconstruct from persistence
   */
  static fromPersistence(data: {
    id: string;
    email: string;
    name: string;
    roles: Role[];
    isActive: boolean;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Result<User> {
    const emailResult = Email.create(data.email);
    if (emailResult.isFailure) {
      return Result.fail<User>(emailResult.error!);
    }

    const nameResult = Name.create(data.name);
    if (nameResult.isFailure) {
      return Result.fail<User>(nameResult.error!);
    }

    return Result.ok(
      new User(
        {
          email: emailResult.getValue(),
          name: nameResult.getValue(),
          roles: data.roles,
          isActive: data.isActive,
          emailVerifiedAt: data.emailVerifiedAt,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        new UniqueEntityId(data.id)
      )
    );
  }

  // Getters
  get email(): Email {
    return this.props.email;
  }

  get name(): Name {
    return this.props.name;
  }

  get roles(): Role[] {
    return [...this.props.roles];
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isEmailVerified(): boolean {
    return this.props.emailVerifiedAt !== null;
  }

  get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Get all permissions from all roles
   */
  get permissions(): string[] {
    const permissionSet = new Set<string>();
    for (const role of this.props.roles) {
      for (const permission of role.permissions) {
        permissionSet.add(permission.name);
      }
    }
    return Array.from(permissionSet);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permissionName: string): boolean {
    return this.props.roles.some((role) => role.hasPermission(permissionName));
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: Role): boolean {
    return this.props.roles.some((r) => r.equals(role));
  }

  /**
   * Check if user has a role by name
   */
  hasRoleByName(roleName: string): boolean {
    return this.props.roles.some((r) => r.name.toLowerCase() === roleName.toLowerCase());
  }

  /**
   * Assign a role to the user
   */
  assignRole(role: Role): void {
    if (!this.hasRole(role)) {
      this.props.roles.push(role);
      this.props.updatedAt = new Date();
    }
  }

  /**
   * Remove a role from the user
   */
  removeRole(role: Role): void {
    const index = this.props.roles.findIndex((r) => r.equals(role));
    if (index > -1) {
      this.props.roles.splice(index, 1);
      this.props.updatedAt = new Date();
    }
  }

  /**
   * Update user name
   */
  updateName(name: string): Result<void> {
    const nameResult = Name.create(name);
    if (nameResult.isFailure) {
      return Result.fail(nameResult.error!);
    }
    this.props.name = nameResult.getValue();
    this.props.updatedAt = new Date();
    return Result.okVoid();
  }

  /**
   * Update user email
   */
  updateEmail(email: string): Result<void> {
    const emailResult = Email.create(email);
    if (emailResult.isFailure) {
      return Result.fail(emailResult.error!);
    }
    this.props.email = emailResult.getValue();
    this.props.emailVerifiedAt = null; // Reset verification
    this.props.updatedAt = new Date();
    return Result.okVoid();
  }

  /**
   * Verify the user's email
   */
  verifyEmail(): void {
    this.props.emailVerifiedAt = new Date();
    this.props.updatedAt = new Date();
  }

  /**
   * Activate the user
   */
  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Deactivate the user
   */
  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}
