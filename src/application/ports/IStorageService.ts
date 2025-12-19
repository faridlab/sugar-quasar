/**
 * Storage Service Port
 * Defines the contract for persistent storage operations
 */
export interface IStorageService {
  /**
   * Get item from storage
   */
  get<T>(key: string): T | null;

  /**
   * Set item in storage
   */
  set<T>(key: string, value: T): void;

  /**
   * Remove item from storage
   */
  remove(key: string): void;

  /**
   * Check if key exists in storage
   */
  has(key: string): boolean;

  /**
   * Clear all items from storage
   */
  clear(): void;
}
