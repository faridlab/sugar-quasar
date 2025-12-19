import type { Permission } from '@/domain/entities/Permission';
import type { UniqueEntityId } from '@/domain/core/UniqueEntityId';
import type { IBaseRepository } from './IBaseRepository';

/**
 * Permission Repository Interface
 */
export interface IPermissionRepository extends IBaseRepository<Permission> {
  findByName(name: string): Promise<Permission | null>;
  findByGroup(group: string): Promise<Permission[]>;
  findByIds(ids: UniqueEntityId[]): Promise<Permission[]>;
}
