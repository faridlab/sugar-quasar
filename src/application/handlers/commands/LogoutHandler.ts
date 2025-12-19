import { Result } from '@/domain/core/Result';
import type { IAuthService } from '@/application/ports/IAuthService';
import type { IStorageService } from '@/application/ports/IStorageService';

/**
 * Logout Command Handler
 * Handles user logout
 */
export class LogoutHandler {
  constructor(
    private readonly authService: IAuthService,
    private readonly storageService: IStorageService
  ) {}

  async execute(): Promise<Result<void>> {
    // Call auth service to logout (invalidate token on server)
    const result = await this.authService.logout();

    // Clear local storage regardless of server response
    this.storageService.remove('token');
    this.storageService.remove('user');
    this.storageService.remove('rememberMe');

    if (result.isFailure) {
      // Log error but don't fail - user is logged out locally
      console.warn('Server logout failed:', result.error);
    }

    return Result.okVoid();
  }
}
