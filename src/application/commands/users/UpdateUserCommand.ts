import { z } from 'zod';

/**
 * Update User Command Schema
 */
export const updateUserCommandSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  roleIds: z.array(z.string().uuid()).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Update User Command Type
 */
export type UpdateUserCommand = z.infer<typeof updateUserCommandSchema>;

/**
 * Validate update user command
 */
export function validateUpdateUserCommand(data: unknown): UpdateUserCommand {
  return updateUserCommandSchema.parse(data);
}
