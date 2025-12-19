import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/presentation/stores/authStore';

/**
 * Auth guard for protected routes
 * Redirects to login if user is not authenticated
 */
export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();

  // Check if route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Store the intended destination for redirect after login
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  next();
}

/**
 * Guest guard for auth pages (login, register)
 * Redirects to home if user is already authenticated
 */
export function guestGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }

  next();
}

/**
 * Permission guard for routes requiring specific permissions
 */
export function permissionGuard(requiredPermission: string) {
  return (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const authStore = useAuthStore();

    if (!authStore.hasPermission(requiredPermission)) {
      next({ name: 'forbidden' });
      return;
    }

    next();
  };
}

/**
 * Role guard for routes requiring specific roles
 */
export function roleGuard(requiredRoles: string[]) {
  return (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const authStore = useAuthStore();

    if (!authStore.hasAnyRole(requiredRoles)) {
      next({ name: 'forbidden' });
      return;
    }

    next();
  };
}
