import type { Result } from '@/domain/core/Result';
import type { AuthUserDTO, LoginCredentialsDTO, RegisterDTO, UserDTO } from '../dtos';

/**
 * Authentication Service Port
 * Defines the contract for authentication operations
 */
export interface IAuthService {
  /**
   * Login with credentials
   */
  login(credentials: LoginCredentialsDTO): Promise<Result<AuthUserDTO>>;

  /**
   * Register a new user
   */
  register(data: RegisterDTO): Promise<Result<AuthUserDTO>>;

  /**
   * Logout current user
   */
  logout(): Promise<Result<void>>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<Result<UserDTO>>;

  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<Result<AuthUserDTO>>;

  /**
   * Request password reset
   */
  forgotPassword(email: string): Promise<Result<void>>;

  /**
   * Reset password with token
   */
  resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<Result<void>>;

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<Result<void>>;

  /**
   * Resend email verification
   */
  resendVerification(): Promise<Result<void>>;
}
