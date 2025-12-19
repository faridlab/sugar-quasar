import type { AxiosInstance } from 'axios';
import { Result } from '@/domain/core/Result';
import type { IAuthService } from '@/application/ports/IAuthService';
import type { AuthUserDTO, LoginCredentialsDTO, RegisterDTO, UserDTO } from '@/application/dtos';
import { API_ENDPOINTS } from '../api/endpoints';
import { extractErrorMessage } from '../api/httpClient';

/**
 * Auth Service Implementation
 * Handles authentication API calls
 */
export class AuthService implements IAuthService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async login(credentials: LoginCredentialsDTO): Promise<Result<AuthUserDTO>> {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async register(data: RegisterDTO): Promise<Result<AuthUserDTO>> {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      await this.httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return Result.okVoid();
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async getCurrentUser(): Promise<Result<UserDTO>> {
    try {
      const response = await this.httpClient.get(API_ENDPOINTS.AUTH.ME);
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async refreshToken(): Promise<Result<AuthUserDTO>> {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.AUTH.REFRESH);
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async forgotPassword(email: string): Promise<Result<void>> {
    try {
      await this.httpClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return Result.okVoid();
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<Result<void>> {
    try {
      await this.httpClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      return Result.okVoid();
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async verifyEmail(token: string): Promise<Result<void>> {
    try {
      await this.httpClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
      return Result.okVoid();
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async resendVerification(): Promise<Result<void>> {
    try {
      await this.httpClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION);
      return Result.okVoid();
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }
}
