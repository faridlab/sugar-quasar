import type { User } from '@/domain/entities/User';
import type { Email } from '@/domain/value-objects/Email';
import type { IBaseRepository } from './IBaseRepository';

/**
 * User Repository Interface
 */
export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
