/**
 * Get Current User Query
 * Retrieves the currently authenticated user
 */
export interface GetCurrentUserQuery {
  readonly _brand: 'GetCurrentUserQuery';
}

/**
 * Create get current user query
 */
export function createGetCurrentUserQuery(): GetCurrentUserQuery {
  return { _brand: 'GetCurrentUserQuery' };
}
