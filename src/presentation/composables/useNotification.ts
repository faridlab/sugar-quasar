import { Notify, Dialog } from 'quasar';
import type { INotificationService } from '@/application/ports/INotificationService';

/**
 * Notification service implementation using Quasar Notify and Dialog
 */
export class QuasarNotificationService implements INotificationService {
  success(message: string): void {
    Notify.create({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 3000,
    });
  }

  error(message: string): void {
    Notify.create({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 5000,
    });
  }

  warning(message: string): void {
    Notify.create({
      type: 'warning',
      message,
      position: 'top-right',
      timeout: 4000,
    });
  }

  info(message: string): void {
    Notify.create({
      type: 'info',
      message,
      position: 'top-right',
      timeout: 3000,
    });
  }

  confirm(message: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      Dialog.create({
        title: title ?? 'Confirm',
        message,
        cancel: true,
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
        .onDismiss(() => resolve(false));
    });
  }

  prompt(message: string, title?: string, defaultValue?: string): Promise<string | null> {
    return new Promise((resolve) => {
      Dialog.create({
        title: title ?? 'Input',
        message,
        prompt: {
          model: defaultValue ?? '',
          type: 'text',
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data: string) => resolve(data))
        .onCancel(() => resolve(null))
        .onDismiss(() => resolve(null));
    });
  }
}

/**
 * Notification composable for components
 * Uses Quasar's Notify and Dialog plugins
 */
export function useNotification() {
  function success(message: string): void {
    Notify.create({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 3000,
    });
  }

  function error(message: string): void {
    Notify.create({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 5000,
    });
  }

  function warning(message: string): void {
    Notify.create({
      type: 'warning',
      message,
      position: 'top-right',
      timeout: 4000,
    });
  }

  function info(message: string): void {
    Notify.create({
      type: 'info',
      message,
      position: 'top-right',
      timeout: 3000,
    });
  }

  function confirm(message: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      Dialog.create({
        title: title ?? 'Confirm',
        message,
        cancel: true,
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
        .onDismiss(() => resolve(false));
    });
  }

  function prompt(message: string, title?: string, defaultValue?: string): Promise<string | null> {
    return new Promise((resolve) => {
      Dialog.create({
        title: title ?? 'Input',
        message,
        prompt: {
          model: defaultValue ?? '',
          type: 'text',
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data: string) => resolve(data))
        .onCancel(() => resolve(null))
        .onDismiss(() => resolve(null));
    });
  }

  return {
    success,
    error,
    warning,
    info,
    confirm,
    prompt,
  };
}
