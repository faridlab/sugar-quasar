import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AuthUserDTO, UserDTO } from '@/application/dtos';
import type { IAuthService } from '@/application/ports/IAuthService';
import type { IStorageService } from '@/application/ports/IStorageService';
import { LoginHandler } from '@/application/handlers/commands/LoginHandler';
import { RegisterHandler } from '@/application/handlers/commands/RegisterHandler';
import { LogoutHandler } from '@/application/handlers/commands/LogoutHandler';
import { GetCurrentUserHandler } from '@/application/handlers/queries/GetCurrentUserHandler';
import { loginCommandSchema, type LoginCommand } from '@/application/commands/auth/LoginCommand';
import {
  registerCommandSchema,
  type RegisterCommand,
} from '@/application/commands/auth/RegisterCommand';
import { Result } from '@/domain/core/Result';
import { httpClient } from '@/infrastructure/api/httpClient';
import { AuthService } from '@/infrastructure/services/AuthService';
import { LocalStorageService } from '@/infrastructure/services/StorageService';

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export const useAuthStore = defineStore('auth', () => {
  // Services (could be injected via DI container in the future)
  const authService: IAuthService = new AuthService(httpClient);
  const storageService: IStorageService = new LocalStorageService();

  // State
  const user = ref<UserDTO | null>(storageService.get<UserDTO>(STORAGE_KEYS.USER));
  const token = ref<string | null>(storageService.get<string>(STORAGE_KEYS.TOKEN));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => token.value !== null && user.value !== null);
  const currentUser = computed(() => user.value);
  const userFullName = computed(() => user.value?.name ?? '');
  const userEmail = computed(() => user.value?.email ?? '');
  const userRoles = computed(() => user.value?.roles ?? []);
  const userPermissions = computed(() => {
    const permissions = new Set<string>();
    user.value?.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions.add(permission.name);
      });
    });
    return Array.from(permissions);
  });

  // Actions
  function clearError(): void {
    error.value = null;
  }

  function setAuthData(authUser: AuthUserDTO): void {
    token.value = authUser.token;
    user.value = authUser.user;
    storageService.set(STORAGE_KEYS.TOKEN, authUser.token);
    storageService.set(STORAGE_KEYS.USER, authUser.user);
  }

  function clearAuthData(): void {
    token.value = null;
    user.value = null;
    storageService.remove(STORAGE_KEYS.TOKEN);
    storageService.remove(STORAGE_KEYS.USER);
  }

  async function login(command: LoginCommand): Promise<Result<AuthUserDTO>> {
    clearError();
    isLoading.value = true;

    try {
      // Validate command using Zod schema
      const parseResult = loginCommandSchema.safeParse(command);
      if (!parseResult.success) {
        const firstError = parseResult.error.errors[0];
        const errorMsg = firstError?.message ?? 'Validation failed';
        error.value = errorMsg;
        return Result.fail(errorMsg);
      }

      // Execute login
      const handler = new LoginHandler(authService, storageService);
      const result = await handler.execute(parseResult.data);

      if (result.isSuccess) {
        const authData = result.getValue();
        setAuthData(authData);
        return Result.ok(authData);
      }

      error.value = result.error ?? 'Login failed';
      return Result.fail(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function register(command: RegisterCommand): Promise<Result<AuthUserDTO>> {
    clearError();
    isLoading.value = true;

    try {
      // Validate command using Zod schema
      const parseResult = registerCommandSchema.safeParse(command);
      if (!parseResult.success) {
        const firstError = parseResult.error.errors[0];
        const errorMsg = firstError?.message ?? 'Validation failed';
        error.value = errorMsg;
        return Result.fail(errorMsg);
      }

      // Execute register
      const handler = new RegisterHandler(authService, storageService);
      const result = await handler.execute(parseResult.data);

      if (result.isSuccess) {
        const authData = result.getValue();
        setAuthData(authData);
        return Result.ok(authData);
      }

      error.value = result.error ?? 'Registration failed';
      return Result.fail(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<Result<void>> {
    clearError();
    isLoading.value = true;

    try {
      const handler = new LogoutHandler(authService, storageService);
      const result = await handler.execute();

      // Clear local state regardless of API result
      clearAuthData();

      if (result.isFailure) {
        // Log but don't show error to user - local logout succeeded
        console.warn('API logout failed:', result.error);
      }

      return Result.okVoid();
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCurrentUser(): Promise<Result<UserDTO>> {
    if (!token.value) {
      return Result.fail('Not authenticated');
    }

    clearError();
    isLoading.value = true;

    try {
      const handler = new GetCurrentUserHandler(authService);
      const result = await handler.execute();

      if (result.isSuccess) {
        const userData = result.getValue();
        user.value = userData;
        storageService.set(STORAGE_KEYS.USER, userData);
        return Result.ok(userData);
      }

      error.value = result.error ?? 'Failed to fetch user';
      return Result.fail(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission);
  }

  function hasRole(roleName: string): boolean {
    return userRoles.value.some((role) => role.name === roleName);
  }

  function hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some((roleName) => hasRole(roleName));
  }

  function hasAllRoles(roleNames: string[]): boolean {
    return roleNames.every((roleName) => hasRole(roleName));
  }

  // Initialize - check stored auth on creation
  function initialize(): void {
    const storedToken = storageService.get<string>(STORAGE_KEYS.TOKEN);
    const storedUser = storageService.get<UserDTO>(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = storedUser;
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    currentUser,
    userFullName,
    userEmail,
    userRoles,
    userPermissions,

    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    initialize,
  };
});
