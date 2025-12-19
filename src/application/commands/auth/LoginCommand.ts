import { z } from 'zod';

/**
 * Login Command Schema
 */
export const loginCommandSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Login Command Type
 */
export type LoginCommand = z.infer<typeof loginCommandSchema>;

/**
 * Validate login command
 */
export function validateLoginCommand(data: unknown): LoginCommand {
  return loginCommandSchema.parse(data);
}
