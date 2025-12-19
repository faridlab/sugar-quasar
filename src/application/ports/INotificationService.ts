/**
 * Notification Service Port
 * Defines the contract for user notifications
 */
export interface INotificationService {
  /**
   * Show success notification
   */
  success(message: string): void;

  /**
   * Show error notification
   */
  error(message: string): void;

  /**
   * Show warning notification
   */
  warning(message: string): void;

  /**
   * Show info notification
   */
  info(message: string): void;

  /**
   * Show confirmation dialog
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirm(message: string, title?: string): Promise<boolean>;

  /**
   * Show prompt dialog
   * @returns Promise that resolves to the input value or null if cancelled
   */
  prompt(message: string, title?: string, defaultValue?: string): Promise<string | null>;
}
