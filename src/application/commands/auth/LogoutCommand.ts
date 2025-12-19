/**
 * Logout Command
 * No parameters required - logs out the current user
 */
export interface LogoutCommand {
  // Marker interface - no parameters needed
  readonly _brand: 'LogoutCommand';
}

/**
 * Create logout command
 */
export function createLogoutCommand(): LogoutCommand {
  return { _brand: 'LogoutCommand' };
}
