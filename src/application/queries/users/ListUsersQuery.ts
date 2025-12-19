import { z } from 'zod';

/**
 * List Users Query Schema
 */
export const listUsersQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  isActive: z.boolean().optional(),
  roleId: z.string().uuid().optional(),
});

/**
 * List Users Query Type
 */
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

/**
 * Validate and create list users query
 */
export function createListUsersQuery(data: Partial<ListUsersQuery> = {}): ListUsersQuery {
  return listUsersQuerySchema.parse(data);
}
