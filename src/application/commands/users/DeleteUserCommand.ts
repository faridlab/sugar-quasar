import { z } from 'zod';

/**
 * Delete User Command Schema
 */
export const deleteUserCommandSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

/**
 * Delete User Command Type
 */
export type DeleteUserCommand = z.infer<typeof deleteUserCommandSchema>;

/**
 * Validate delete user command
 */
export function validateDeleteUserCommand(data: unknown): DeleteUserCommand {
  return deleteUserCommandSchema.parse(data);
}
