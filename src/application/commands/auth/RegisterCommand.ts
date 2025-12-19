import { z } from 'zod';

/**
 * Register Command Schema
 */
export const registerCommandSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

/**
 * Register Command Type
 */
export type RegisterCommand = z.infer<typeof registerCommandSchema>;

/**
 * Validate register command
 */
export function validateRegisterCommand(data: unknown): RegisterCommand {
  return registerCommandSchema.parse(data);
}
