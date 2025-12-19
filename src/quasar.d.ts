// Vue component type for .vue files
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// Quasar wrappers module
declare module 'quasar/wrappers' {
  import type { App } from 'vue';
  import type { Router, RouteLocationNormalized } from 'vue-router';
  import type { Pinia } from 'pinia';

  interface BootFileParams {
    app: App;
    router: Router;
    store: Pinia;
    ssrContext?: unknown;
    urlPath: string;
    publicPath: string;
    redirect: (url: string) => void;
  }

  type BootCallback = (params: BootFileParams) => void | Promise<void>;

  export function boot(callback: BootCallback): BootCallback;

  interface RouteMiddlewareParams {
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
    next: () => void;
    redirect: (path: string) => void;
  }

  export function route(
    callback: (params: RouteMiddlewareParams) => void
  ): (params: RouteMiddlewareParams) => void;

  export function configure<T>(callback: () => T): T;
}
