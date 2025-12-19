import { Result } from '@/domain/core/Result';
import type { IAuthService } from '@/application/ports/IAuthService';
import type { IStorageService } from '@/application/ports/IStorageService';
import type { RegisterCommand } from '@/application/commands/auth/RegisterCommand';
import type { AuthUserDTO } from '@/application/dtos';

/**
 * Register Command Handler
 * Handles user registration
 */
export class RegisterHandler {
  constructor(
    private readonly authService: IAuthService,
    private readonly storageService: IStorageService
  ) {}

  async execute(command: RegisterCommand): Promise<Result<AuthUserDTO>> {
    // Call auth service to register
    const result = await this.authService.register({
      name: command.name,
      email: command.email,
      password: command.password,
      passwordConfirmation: command.passwordConfirmation,
    });

    if (result.isFailure) {
      return Result.fail(result.error!);
    }

    const authData = result.getValue();

    // Store token
    this.storageService.set('token', authData.token);
    this.storageService.set('user', authData.user);

    return Result.ok(authData);
  }
}
