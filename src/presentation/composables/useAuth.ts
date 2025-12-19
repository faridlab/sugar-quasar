import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import type { LoginCommand } from '@/application/commands/auth/LoginCommand';
import type { RegisterCommand } from '@/application/commands/auth/RegisterCommand';

/**
 * Auth composable for components
 * Provides auth functionality with router integration
 */
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  // Computed state from store
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.error);
  const user = computed(() => authStore.currentUser);
  const userFullName = computed(() => authStore.userFullName);
  const userEmail = computed(() => authStore.userEmail);

  /**
   * Login and redirect on success
   */
  async function login(command: LoginCommand, redirectTo: string = '/'): Promise<boolean> {
    const result = await authStore.login(command);

    if (result.isSuccess) {
      await router.push(redirectTo);
      return true;
    }

    return false;
  }

  /**
   * Register and redirect on success
   */
  async function register(command: RegisterCommand, redirectTo: string = '/'): Promise<boolean> {
    const result = await authStore.register(command);

    if (result.isSuccess) {
      await router.push(redirectTo);
      return true;
    }

    return false;
  }

  /**
   * Logout and redirect to login
   */
  async function logout(redirectTo: string = '/login'): Promise<void> {
    await authStore.logout();
    await router.push(redirectTo);
  }

  /**
   * Clear any auth errors
   */
  function clearError(): void {
    authStore.clearError();
  }

  /**
   * Check if user has a specific permission
   */
  function hasPermission(permission: string): boolean {
    return authStore.hasPermission(permission);
  }

  /**
   * Check if user has a specific role
   */
  function hasRole(roleName: string): boolean {
    return authStore.hasRole(roleName);
  }

  /**
   * Check if user has any of the specified roles
   */
  function hasAnyRole(roleNames: string[]): boolean {
    return authStore.hasAnyRole(roleNames);
  }

  /**
   * Check if user has all of the specified roles
   */
  function hasAllRoles(roleNames: string[]): boolean {
    return authStore.hasAllRoles(roleNames);
  }

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    user,
    userFullName,
    userEmail,

    // Actions
    login,
    register,
    logout,
    clearError,

    // Permission checks
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}
