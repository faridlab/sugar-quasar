import { z } from 'zod';

/**
 * Create User Command Schema
 */
export const createUserCommandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleIds: z.array(z.string().uuid()).min(1, 'At least one role is required'),
});

/**
 * Create User Command Type
 */
export type CreateUserCommand = z.infer<typeof createUserCommandSchema>;

/**
 * Validate create user command
 */
export function validateCreateUserCommand(data: unknown): CreateUserCommand {
  return createUserCommandSchema.parse(data);
}
