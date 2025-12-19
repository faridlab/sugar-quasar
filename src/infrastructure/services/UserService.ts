import type { AxiosInstance } from 'axios';
import { Result } from '@/domain/core/Result';
import type { UserDTO, CreateUserDTO, UpdateUserDTO } from '@/application/dtos';
import { API_ENDPOINTS } from '../api/endpoints';
import { extractErrorMessage, type PaginatedApiResponse } from '../api/httpClient';

export interface UserFilters {
  search?: string | undefined;
  role?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
  page?: number | undefined;
  perPage?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

/**
 * User Service Implementation
 * Handles user CRUD API calls
 */
export class UserService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async list(filters?: UserFilters): Promise<Result<PaginatedApiResponse<UserDTO>>> {
    try {
      const response = await this.httpClient.get(API_ENDPOINTS.USERS.LIST, {
        params: {
          search: filters?.search,
          role: filters?.role,
          status: filters?.status,
          page: filters?.page ?? 1,
          per_page: filters?.perPage ?? 15,
          sort_by: filters?.sortBy,
          sort_order: filters?.sortOrder,
        },
      });
      return Result.ok(response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async getById(id: string): Promise<Result<UserDTO>> {
    try {
      const response = await this.httpClient.get(API_ENDPOINTS.USERS.GET(id));
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async create(data: CreateUserDTO): Promise<Result<UserDTO>> {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.USERS.CREATE, {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        roles: data.roleIds,
      });
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<Result<UserDTO>> {
    try {
      const response = await this.httpClient.put(API_ENDPOINTS.USERS.UPDATE(id), {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        roles: data.roleIds,
        is_active: data.isActive,
      });
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.httpClient.delete(API_ENDPOINTS.USERS.DELETE(id));
      return Result.okVoid();
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }

  async restore(id: string): Promise<Result<UserDTO>> {
    try {
      const response = await this.httpClient.post(API_ENDPOINTS.USERS.RESTORE(id));
      return Result.ok(response.data.data ?? response.data);
    } catch (error) {
      return Result.fail(extractErrorMessage(error));
    }
  }
}
