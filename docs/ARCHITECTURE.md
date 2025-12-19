# Sugar Quasar v2.0 - Architecture Document

## Overview

This document outlines the architecture decisions for the Sugar Quasar v2.0 rewrite, following DDD (Domain-Driven Design), Clean Architecture, SOLID principles, and CQRS patterns.

**Key Principle**: Quasar is the **container** that wraps the entire application. All DDD/Clean Architecture layers live **inside** the Quasar project structure.

---

## Quasar as the Application Container

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         QUASAR FRAMEWORK                                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    quasar.config.ts                                │  │
│  │              (Controls everything: build, plugins, boot)          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  src/                                                              │  │
│  │  ├── boot/           ← Quasar boot files (init app)               │  │
│  │  ├── domain/         ← Pure TypeScript (no Vue/Quasar)            │  │
│  │  ├── application/    ← Pure TypeScript (no Vue/Quasar)            │  │
│  │  ├── infrastructure/ ← Pure TypeScript (no Vue/Quasar)            │  │
│  │  └── presentation/   ← Vue + Quasar components                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Quasar CLI (build, dev, generate)                                      │
│  Quasar Plugins ($q.notify, $q.dialog, $q.loading, etc.)                │
│  Quasar Components (QBtn, QTable, QForm, etc.)                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Leveraging Quasar's Powerful Features

We will maximize Quasar's built-in capabilities:

| Quasar Feature | Usage |
|----------------|-------|
| **$q.notify()** | Toast notifications, success/error messages |
| **$q.dialog()** | Confirmation dialogs, prompts, custom dialogs |
| **$q.loading** | Full-screen loading overlay |
| **$q.loadingBar** | Top progress bar for navigation |
| **$q.localStorage** | Type-safe local storage wrapper |
| **$q.sessionStorage** | Type-safe session storage wrapper |
| **$q.cookies** | Cookie management |
| **$q.screen** | Responsive breakpoints |
| **$q.dark** | Dark mode support |
| **$q.platform** | Platform detection (mobile, desktop, etc.) |
| **useQuasar()** | Composition API access to $q |
| **QTable** | Powerful data tables with sorting, filtering, pagination |
| **QForm** | Form validation and submission |
| **QLayout/QPage** | Responsive layouts |
| **QDrawer** | Sidebar navigation |
| **Meta plugin** | SEO meta tags |

### Boot Files (Application Initialization)

Boot files initialize the application in order:

```typescript
// quasar.config.ts
boot: [
  'i18n',           // Internationalization
  'axios',          // HTTP client setup
  'pinia',          // State management
  'query',          // TanStack Query
  'di',             // Dependency Injection container
  'auth',           // Auth initialization (check token)
  'permissions',    // Load permissions
]
```

### Quasar + DDD Integration Example

```typescript
// src/boot/di.ts - Dependency Injection via Quasar boot file
import { boot } from 'quasar/wrappers';
import { createContainer } from '@/infrastructure/di/container';

export default boot(({ app }) => {
  const container = createContainer();

  // Provide all handlers to Vue app
  app.provide('container', container);

  // Make available via $q for convenience
  app.config.globalProperties.$container = container;
});
```

```typescript
// src/presentation/composables/useQuasarNotify.ts
import { useQuasar } from 'quasar';
import type { INotificationPort } from '@/application/ports/INotificationPort';

export function useQuasarNotify(): INotificationPort {
  const $q = useQuasar();

  return {
    success(message: string) {
      $q.notify({ type: 'positive', message });
    },
    error(message: string) {
      $q.notify({ type: 'negative', message });
    },
    warning(message: string) {
      $q.notify({ type: 'warning', message });
    },
    info(message: string) {
      $q.notify({ type: 'info', message });
    },
    confirm(message: string): Promise<boolean> {
      return new Promise((resolve) => {
        $q.dialog({
          title: 'Confirm',
          message,
          cancel: true,
          persistent: true,
        })
          .onOk(() => resolve(true))
          .onCancel(() => resolve(false));
      });
    },
  };
}
```

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Vue 3 | ^3.5.x |
| **UI Framework** | Quasar | ^2.17.x |
| **Build Tool** | Vite | ^6.x |
| **Runtime** | Bun | latest |
| **Package Manager** | Yarn | ^4.x |
| **Language** | TypeScript | ^5.7.x (very strict) |
| **State Management** | Pinia | ^2.3.x |
| **Server State** | TanStack Query | ^5.x |
| **Validation** | Zod | ^3.x |
| **HTTP Client** | Axios | ^1.x |
| **Routing** | Vue Router | ^4.5.x |
| **Testing** | Vitest + Playwright | latest |
| **i18n** | Vue I18n | ^10.x |

---

## Architecture Principles

### 1. Clean Architecture (Layered)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│         (Vue, Quasar, Components, Pages, Stores)            │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                         │
│              (Commands, Queries, Handlers, DTOs)            │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                              │
│     (Entities, Value Objects, Repository Interfaces)        │
├─────────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE LAYER                        │
│        (API Clients, Repository Implementations)            │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Inner layers MUST NOT depend on outer layers.

- Domain → No dependencies
- Application → Depends on Domain only
- Infrastructure → Depends on Domain + Application
- Presentation → Depends on all layers

### 2. CQRS (Command Query Responsibility Segregation)

- **Commands**: Write operations that modify state
- **Queries**: Read operations that return data
- Separation allows optimization and scaling of read/write paths independently

### 3. SOLID Principles

- **S**ingle Responsibility: Each class/module has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable for base types
- **I**nterface Segregation: Many specific interfaces over one general
- **D**ependency Inversion: Depend on abstractions, not concretions

---

## Project Structure

```
sugar-quasar/
├── docs/                          # Documentation
├── e2e/                           # Playwright E2E tests
├── public/                        # Static assets
├── src/
│   ├── domain/                    # Domain Layer (Pure TypeScript)
│   │   ├── entities/              # Domain entities
│   │   │   ├── User.ts
│   │   │   ├── Role.ts
│   │   │   ├── Permission.ts
│   │   │   └── ...
│   │   ├── value-objects/         # Immutable value objects
│   │   │   ├── Email.ts
│   │   │   ├── Password.ts
│   │   │   ├── Money.ts
│   │   │   └── ...
│   │   ├── repositories/          # Repository interfaces (contracts)
│   │   │   ├── IUserRepository.ts
│   │   │   ├── IRoleRepository.ts
│   │   │   └── IBaseRepository.ts
│   │   ├── services/              # Domain services
│   │   │   └── AuthorizationService.ts
│   │   ├── core/                  # Core utilities (Result, UniqueEntityId)
│   │   │   ├── Result.ts
│   │   │   └── UniqueEntityId.ts
│   │   └── errors/                # Domain-specific errors
│   │       ├── DomainError.ts
│   │       ├── ValidationError.ts
│   │       └── NotFoundError.ts
│   │
│   ├── application/               # Application Layer (Use Cases)
│   │   ├── commands/              # Write operations
│   │   │   ├── auth/
│   │   │   │   ├── LoginCommand.ts
│   │   │   │   ├── LogoutCommand.ts
│   │   │   │   └── RegisterCommand.ts
│   │   │   ├── users/
│   │   │   │   ├── CreateUserCommand.ts
│   │   │   │   ├── UpdateUserCommand.ts
│   │   │   │   └── DeleteUserCommand.ts
│   │   │   └── ...
│   │   ├── queries/               # Read operations
│   │   │   ├── users/
│   │   │   │   ├── GetUserByIdQuery.ts
│   │   │   │   ├── ListUsersQuery.ts
│   │   │   │   └── SearchUsersQuery.ts
│   │   │   └── ...
│   │   ├── handlers/              # Command & Query handlers
│   │   │   ├── commands/
│   │   │   │   └── ...
│   │   │   └── queries/
│   │   │       └── ...
│   │   ├── dtos/                  # Data Transfer Objects
│   │   │   ├── UserDTO.ts
│   │   │   ├── RoleDTO.ts
│   │   │   └── ...
│   │   ├── mappers/               # Entity <-> DTO mappers
│   │   │   ├── UserMapper.ts
│   │   │   └── ...
│   │   └── ports/                 # Application ports (interfaces)
│   │       ├── IAuthService.ts
│   │       ├── INotificationService.ts
│   │       └── ...
│   │
│   ├── infrastructure/            # Infrastructure Layer
│   │   ├── api/                   # HTTP client setup
│   │   │   ├── axios.ts           # Axios instance configuration
│   │   │   ├── interceptors.ts    # Request/response interceptors
│   │   │   └── endpoints.ts       # API endpoint constants
│   │   ├── repositories/          # Repository implementations
│   │   │   ├── UserRepository.ts
│   │   │   ├── RoleRepository.ts
│   │   │   └── BaseRepository.ts
│   │   ├── services/              # External service implementations
│   │   │   ├── AuthService.ts
│   │   │   ├── StorageService.ts
│   │   │   └── NotificationService.ts
│   │   ├── persistence/           # Local storage, caching
│   │   │   ├── LocalStorageAdapter.ts
│   │   │   └── SessionStorageAdapter.ts
│   │   └── mappers/               # API response mappers
│   │       ├── ApiUserMapper.ts
│   │       └── ...
│   │
│   ├── presentation/              # Presentation Layer (Vue/Quasar)
│   │   ├── components/            # Reusable UI components
│   │   │   ├── common/            # Generic components
│   │   │   │   ├── AppButton.vue
│   │   │   │   ├── AppCard.vue
│   │   │   │   ├── AppDialog.vue
│   │   │   │   └── ...
│   │   │   ├── forms/             # Form components
│   │   │   │   ├── FormInput.vue
│   │   │   │   ├── FormSelect.vue
│   │   │   │   ├── FormDatePicker.vue
│   │   │   │   └── ...
│   │   │   ├── tables/            # Table components
│   │   │   │   ├── DataTable.vue
│   │   │   │   ├── TablePagination.vue
│   │   │   │   └── ...
│   │   │   └── feedback/          # Feedback components
│   │   │       ├── LoadingSpinner.vue
│   │   │       ├── ErrorMessage.vue
│   │   │       └── ...
│   │   ├── composables/           # Vue composables
│   │   │   ├── useAuth.ts
│   │   │   ├── usePermissions.ts
│   │   │   ├── useNotification.ts
│   │   │   ├── usePagination.ts
│   │   │   └── ...
│   │   ├── layouts/               # Page layouts
│   │   │   ├── MainLayout.vue
│   │   │   ├── AuthLayout.vue
│   │   │   └── BlankLayout.vue
│   │   ├── pages/                 # Route pages
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.vue
│   │   │   │   ├── RegisterPage.vue
│   │   │   │   └── ForgotPasswordPage.vue
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.vue
│   │   │   ├── users/
│   │   │   │   ├── UserListPage.vue
│   │   │   │   ├── UserCreatePage.vue
│   │   │   │   ├── UserEditPage.vue
│   │   │   │   └── UserDetailPage.vue
│   │   │   ├── roles/
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── stores/                # Pinia stores (thin layer)
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts         # UI state (sidebar, theme, etc.)
│   │   │   └── ...
│   │   ├── directives/            # Vue directives
│   │   │   ├── vCan.ts            # Permission directive
│   │   │   └── ...
│   │   └── plugins/               # Vue plugins
│   │       └── ...
│   │
│   ├── quasar/                    # Quasar-specific configuration
│   │   ├── boot/                  # Boot files
│   │   │   ├── axios.ts
│   │   │   ├── i18n.ts
│   │   │   ├── pinia.ts
│   │   │   └── query.ts           # TanStack Query setup
│   │   └── plugins.ts             # Quasar plugins config
│   │
│   ├── router/                    # Vue Router
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── guards/                # Navigation guards
│   │   │   ├── authGuard.ts
│   │   │   └── permissionGuard.ts
│   │   └── middleware/            # Route middleware
│   │       └── ...
│   │
│   ├── i18n/                      # Internationalization
│   │   ├── index.ts
│   │   ├── locales/
│   │   │   ├── en-US/
│   │   │   └── id-ID/
│   │   └── types.ts
│   │
│   ├── shared/                    # Shared utilities (framework-agnostic)
│   │   ├── types/                 # TypeScript types/interfaces
│   │   │   ├── api.ts             # API response types
│   │   │   ├── pagination.ts
│   │   │   └── ...
│   │   ├── constants/             # Application constants
│   │   │   ├── app.ts
│   │   │   ├── permissions.ts
│   │   │   └── ...
│   │   ├── schemas/               # Zod validation schemas
│   │   │   ├── userSchema.ts
│   │   │   ├── authSchema.ts
│   │   │   └── ...
│   │   ├── utils/                 # Utility functions
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   ├── number.ts
│   │   │   └── ...
│   │   └── errors/                # Application errors
│   │       ├── AppError.ts
│   │       └── ...
│   │
│   ├── App.vue                    # Root component
│   └── main.ts                    # Application entry point
│
├── tests/                         # Unit tests (Vitest)
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│
├── .env                           # Environment variables
├── .env.development
├── .env.production
├── index.html                     # HTML entry point
├── quasar.config.ts               # Quasar configuration
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── vitest.config.ts               # Vitest configuration
├── playwright.config.ts           # Playwright configuration
├── eslint.config.js               # ESLint flat config
├── package.json
└── yarn.lock
```

---

## Layer Details

### Domain Layer

The innermost layer containing business logic. **No framework dependencies** (no Vue, no Quasar).

#### Entities (Rich Domain Models)

> **Note**: We intentionally skip Domain Events for the frontend. Side effects (toasts, redirects, etc.) are handled directly in command handlers or composables.

```typescript
// src/domain/entities/base/Entity.ts
export abstract class Entity<T> {
  protected readonly _id: UniqueEntityId;
  protected props: T;

  constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    return this._id.equals(entity._id);
  }
}

// src/domain/entities/User.ts
interface UserProps {
  email: Email;
  name: Name;
  roles: Role[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // Factory method with validation
  static create(props: CreateUserProps, id?: UniqueEntityId): Result<User> {
    const emailOrError = Email.create(props.email);
    const nameOrError = Name.create(props.name);

    const combinedResult = Result.combine([emailOrError, nameOrError]);
    if (combinedResult.isFailure) {
      return Result.fail(combinedResult.error);
    }

    const user = new User(
      {
        email: emailOrError.getValue(),
        name: nameOrError.getValue(),
        roles: props.roles ?? [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );

    return Result.ok(user);
  }

  // Getters
  get email(): Email {
    return this.props.email;
  }
  get name(): Name {
    return this.props.name;
  }
  get roles(): Role[] {
    return this.props.roles;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }

  // Business methods
  assignRole(role: Role): void {
    if (!this.hasRole(role)) {
      this.props.roles.push(role);
      this.props.updatedAt = new Date();
    }
  }

  removeRole(role: Role): void {
    const index = this.props.roles.findIndex((r) => r.equals(role));
    if (index > -1) {
      this.props.roles.splice(index, 1);
      this.props.updatedAt = new Date();
    }
  }

  hasRole(role: Role): boolean {
    return this.props.roles.some((r) => r.equals(role));
  }

  hasPermission(permission: string): boolean {
    return this.props.roles.some((role) => role.hasPermission(permission));
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
}
```

#### Value Objects (Immutable)

```typescript
// src/domain/value-objects/Email.ts
export class Email extends ValueObject<{ value: string }> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    super({ value });
  }

  static create(email: string): Result<Email> {
    if (!email || email.trim().length === 0) {
      return Result.fail<Email>('Email cannot be empty');
    }

    const trimmed = email.trim().toLowerCase();

    if (!this.EMAIL_REGEX.test(trimmed)) {
      return Result.fail<Email>('Invalid email format');
    }

    return Result.ok<Email>(new Email(trimmed));
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}

// src/domain/value-objects/Name.ts
export class Name extends ValueObject<{ value: string }> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(value: string) {
    super({ value });
  }

  static create(name: string): Result<Name> {
    if (!name || name.trim().length < this.MIN_LENGTH) {
      return Result.fail<Name>(`Name must be at least ${this.MIN_LENGTH} characters`);
    }

    if (name.length > this.MAX_LENGTH) {
      return Result.fail<Name>(`Name cannot exceed ${this.MAX_LENGTH} characters`);
    }

    return Result.ok<Name>(new Name(name.trim()));
  }

  get value(): string {
    return this.props.value;
  }
}

// src/domain/value-objects/Money.ts
export class Money extends ValueObject<{ amount: number; currency: string }> {
  private constructor(amount: number, currency: string) {
    super({ amount, currency });
  }

  static create(amount: number, currency: string = 'USD'): Result<Money> {
    if (amount < 0) {
      return Result.fail<Money>('Amount cannot be negative');
    }
    return Result.ok<Money>(new Money(amount, currency));
  }

  add(money: Money): Result<Money> {
    if (this.props.currency !== money.props.currency) {
      return Result.fail<Money>('Cannot add different currencies');
    }
    return Money.create(this.props.amount + money.props.amount, this.props.currency);
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.props.currency,
    }).format(this.props.amount);
  }
}
```

#### Result Pattern (Error Handling)

```typescript
// src/domain/core/Result.ts
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: string;
  private _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<unknown>[]): Result<void> {
    for (const result of results) {
      if (result.isFailure) return Result.fail(result.error!);
    }
    return Result.ok();
  }
}
```

#### Repository Interfaces

```typescript
// src/domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: UniqueEntityId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(params: PaginationParams): Promise<PaginatedResult<User>>;
  save(user: User): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
  exists(email: Email): Promise<boolean>;
}
```

### Application Layer

Contains use cases (commands/queries) and orchestrates domain logic.

```typescript
// src/application/commands/users/CreateUserCommand.ts
export interface CreateUserCommand {
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly roleIds: string[];
}

// src/application/handlers/commands/CreateUserHandler.ts
export class CreateUserHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserDTO> {
    const email = Email.create(command.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new DomainError('User with this email already exists');
    }

    const roles = await this.roleRepository.findByIds(command.roleIds);

    const user = await this.userRepository.save({
      id: crypto.randomUUID(),
      email,
      name: command.name,
      roles,
      permissions: this.extractPermissions(roles),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return UserMapper.toDTO(user);
  }
}

// src/application/queries/users/ListUsersQuery.ts
export interface ListUsersQuery {
  readonly page: number;
  readonly limit: number;
  readonly search?: string;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

// src/application/handlers/queries/ListUsersHandler.ts
export class ListUsersHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: ListUsersQuery): Promise<PaginatedResult<UserDTO>> {
    const result = await this.userRepository.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      data: result.data.map(UserMapper.toDTO),
      meta: result.meta,
    };
  }
}
```

### Infrastructure Layer

Implements interfaces defined in domain/application layers.

```typescript
// src/infrastructure/repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  constructor(private readonly httpClient: AxiosInstance) {}

  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get(`/users/${id}`);
      return ApiUserMapper.toDomain(response.data);
    } catch (error) {
      if (isNotFoundError(error)) return null;
      throw error;
    }
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
    const response = await this.httpClient.get('/users', { params });
    return {
      data: response.data.data.map(ApiUserMapper.toDomain),
      meta: response.data.meta,
    };
  }

  async save(user: User): Promise<User> {
    const payload = ApiUserMapper.toApi(user);
    const response = user.id
      ? await this.httpClient.put(`/users/${user.id}`, payload)
      : await this.httpClient.post('/users', payload);
    return ApiUserMapper.toDomain(response.data);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(`/users/${id}`);
  }
}
```

### Presentation Layer

Vue/Quasar components that consume application layer via Pinia + TanStack Query.

```typescript
// src/presentation/stores/authStore.ts
import { defineStore } from 'pinia';
import type { User } from '@/domain/entities/User';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    permissions: (state) => state.user?.permissions ?? [],
    hasPermission: (state) => (permission: string) => {
      return state.user?.permissions.some(p =>
        p.name === permission || p.name === '*'
      ) ?? false;
    },
  },

  actions: {
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
```

```typescript
// src/presentation/composables/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { ListUsersQuery } from '@/application/queries/users/ListUsersQuery';
import type { CreateUserCommand } from '@/application/commands/users/CreateUserCommand';

export function useUsers(query: Ref<ListUsersQuery>) {
  const queryClient = useQueryClient();
  const listUsersHandler = inject<ListUsersHandler>('listUsersHandler')!;
  const createUserHandler = inject<CreateUserHandler>('createUserHandler')!;

  const usersQuery = useQuery({
    queryKey: ['users', query],
    queryFn: () => listUsersHandler.execute(query.value),
  });

  const createUserMutation = useMutation({
    mutationFn: (command: CreateUserCommand) => createUserHandler.execute(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
  };
}
```

```vue
<!-- src/presentation/pages/users/UserListPage.vue -->
<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Users</h1>
      <q-btn
        v-can="'users.create'"
        color="primary"
        label="Create User"
        @click="router.push({ name: 'users.create' })"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="users?.data ?? []"
      :loading="isLoading"
      :pagination="pagination"
      @update:pagination="handlePaginationChange"
    >
      <template #body-cell-actions="{ row }">
        <q-btn
          v-can="'users.update'"
          flat
          icon="edit"
          @click="router.push({ name: 'users.edit', params: { id: row.id } })"
        />
        <q-btn
          v-can="'users.delete'"
          flat
          icon="delete"
          color="negative"
          @click="confirmDelete(row)"
        />
      </template>
    </DataTable>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsers } from '@/presentation/composables/useUsers';
import DataTable from '@/presentation/components/tables/DataTable.vue';

const router = useRouter();

const query = ref({
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
});

const { users, isLoading } = useUsers(query);

const columns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'roles', label: 'Roles', field: 'roles' },
  { name: 'createdAt', label: 'Created', field: 'createdAt', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions' },
];

// ... rest of component logic
</script>
```

---

## Data Flow

### Command Flow (Write Operations)

```
┌──────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌────────────────┐
│  Component   │───▶│ Pinia Store  │───▶│ Command Handler │───▶│   Repository   │
│  (Vue)       │    │  (Action)    │    │  (Application)  │    │(Infrastructure)│
└──────────────┘    └──────────────┘    └─────────────────┘    └────────────────┘
                                                                        │
                                                                        ▼
                                                               ┌────────────────┐
                                                               │   HTTP API     │
                                                               └────────────────┘
```

### Query Flow (Read Operations)

```
┌──────────────┐    ┌────────────────┐    ┌───────────────┐    ┌────────────────┐
│  Component   │───▶│ TanStack Query │───▶│ Query Handler │───▶│   Repository   │
│  (Vue)       │    │  (Composable)  │    │ (Application) │    │(Infrastructure)│
└──────────────┘    └────────────────┘    └───────────────┘    └────────────────┘
       ▲                    │                                          │
       │                    │                                          ▼
       │              ┌─────┴─────┐                           ┌────────────────┐
       └──────────────│   Cache   │                           │   HTTP API     │
                      └───────────┘                           └────────────────┘
```

---

## Dependency Injection

We'll use Vue's provide/inject for dependency injection:

```typescript
// src/main.ts
import { createApp } from 'vue';
import { createAxiosInstance } from '@/infrastructure/api/axios';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { CreateUserHandler } from '@/application/handlers/commands/CreateUserHandler';
import { ListUsersHandler } from '@/application/handlers/queries/ListUsersHandler';

const app = createApp(App);

// Create infrastructure instances
const httpClient = createAxiosInstance();
const userRepository = new UserRepository(httpClient);

// Create handlers with dependencies injected
const createUserHandler = new CreateUserHandler(userRepository, roleRepository);
const listUsersHandler = new ListUsersHandler(userRepository);

// Provide to Vue app
app.provide('createUserHandler', createUserHandler);
app.provide('listUsersHandler', listUsersHandler);
```

---

## Validation with Zod

```typescript
// src/shared/schemas/userSchema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleIds: z.array(z.string().uuid()).min(1, 'At least one role is required'),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

```typescript
// Usage in component
import { createUserSchema } from '@/shared/schemas/userSchema';

const form = ref({
  email: '',
  name: '',
  password: '',
  roleIds: [],
});

const errors = ref<Record<string, string>>({});

function validate() {
  const result = createUserSchema.safeParse(form.value);
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors;
    return false;
  }
  errors.value = {};
  return true;
}
```

---

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@presentation/*": ["src/presentation/*"],
      "@shared/*": ["src/shared/*"]
    },
    "types": ["vite/client", "vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Features to Implement

Based on the current codebase, the following features will be rebuilt:

### Core Features

1. **Authentication & Authorization**
   - Login/Logout
   - Registration
   - Password reset
   - Email verification
   - Permission-based access control
   - `v-can` directive

2. **User Management**
   - CRUD operations
   - Role assignment
   - Profile management

3. **Role & Permission Management**
   - Role CRUD
   - Permission assignment
   - Hierarchical permissions

4. **Resource Management** (Generic CRUD)
   - Countries
   - Provinces/States
   - Cities
   - Addresses
   - Contacts
   - Banners
   - FAQ
   - Terms & Conditions
   - System Parameters
   - Notifications

5. **File Management**
   - File upload
   - File browser

6. **UI Features**
   - Responsive layouts
   - Theme support
   - Loading states
   - Error handling
   - Toast notifications
   - Confirmation dialogs

7. **Internationalization**
   - Multi-language support
   - RTL support ready

---

## Migration Strategy

1. **Phase 1: Setup**
   - Initialize new Vite + Quasar project
   - Configure TypeScript (strict mode)
   - Setup Pinia + TanStack Query
   - Configure testing (Vitest + Playwright)

2. **Phase 2: Domain Layer**
   - Define entities and value objects
   - Define repository interfaces
   - Implement domain services

3. **Phase 3: Application Layer**
   - Implement commands and queries
   - Create handlers
   - Define DTOs and mappers

4. **Phase 4: Infrastructure Layer**
   - Implement repositories
   - Setup HTTP client
   - Create API mappers

5. **Phase 5: Presentation Layer**
   - Create base components
   - Build layouts
   - Implement pages
   - Create composables
   - Setup Pinia stores

6. **Phase 6: Integration**
   - Wire up dependency injection
   - Test end-to-end flows
   - Optimize performance

7. **Phase 7: Polish**
   - Add E2E tests
   - Documentation
   - Performance optimization
   - Security audit

---

## Next Steps

After agreement on this architecture:

1. Create new project with Vite + Quasar + TypeScript
2. Setup development environment
3. Implement domain layer first
4. Build outward to presentation layer
