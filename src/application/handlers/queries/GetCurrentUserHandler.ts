import { Result } from '@/domain/core/Result';
import type { IAuthService } from '@/application/ports/IAuthService';
import type { UserDTO } from '@/application/dtos';

/**
 * Get Current User Query Handler
 * Retrieves the currently authenticated user from the server
 */
export class GetCurrentUserHandler {
  constructor(private readonly authService: IAuthService) {}

  async execute(): Promise<Result<UserDTO>> {
    return this.authService.getCurrentUser();
  }
}
