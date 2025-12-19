import type { Role } from '@/domain/entities/Role';
import type { UniqueEntityId } from '@/domain/core/UniqueEntityId';
import type { IBaseRepository } from './IBaseRepository';

/**
 * Role Repository Interface
 */
export interface IRoleRepository extends IBaseRepository<Role> {
  findByName(name: string): Promise<Role | null>;
  findByIds(ids: UniqueEntityId[]): Promise<Role[]>;
  existsByName(name: string): Promise<boolean>;
}
