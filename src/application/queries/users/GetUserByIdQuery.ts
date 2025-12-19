import { z } from 'zod';

/**
 * Get User By ID Query Schema
 */
export const getUserByIdQuerySchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

/**
 * Get User By ID Query Type
 */
export type GetUserByIdQuery = z.infer<typeof getUserByIdQuerySchema>;

/**
 * Validate and create get user by id query
 */
export function createGetUserByIdQuery(id: string): GetUserByIdQuery {
  return getUserByIdQuerySchema.parse({ id });
}
