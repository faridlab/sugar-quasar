import type { UniqueEntityId } from '@/domain/core/UniqueEntityId';

/**
 * Pagination parameters for list queries
 */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

/**
 * Paginated result wrapper
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

/**
 * Base repository interface
 * Defines common operations for all repositories
 */
export interface IBaseRepository<T> {
  findById(id: UniqueEntityId): Promise<T | null>;
  findAll(params: PaginationParams): Promise<PaginatedResult<T>>;
  save(entity: T): Promise<void>;
  delete(id: UniqueEntityId): Promise<void>;
  exists(id: UniqueEntityId): Promise<boolean>;
}
