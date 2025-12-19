import { Result } from '@/domain/core/Result';
import type { IAuthService } from '@/application/ports/IAuthService';
import type { IStorageService } from '@/application/ports/IStorageService';
import type { LoginCommand } from '@/application/commands/auth/LoginCommand';
import type { AuthUserDTO } from '@/application/dtos';

/**
 * Login Command Handler
 * Handles user authentication
 */
export class LoginHandler {
  constructor(
    private readonly authService: IAuthService,
    private readonly storageService: IStorageService
  ) {}

  async execute(command: LoginCommand): Promise<Result<AuthUserDTO>> {
    // Call auth service to login
    const result = await this.authService.login({
      email: command.email,
      password: command.password,
      rememberMe: command.rememberMe,
    });

    if (result.isFailure) {
      return Result.fail(result.error!);
    }

    const authData = result.getValue();

    // Store token
    this.storageService.set('token', authData.token);
    this.storageService.set('user', authData.user);

    if (command.rememberMe) {
      this.storageService.set('rememberMe', true);
    }

    return Result.ok(authData);
  }
}
