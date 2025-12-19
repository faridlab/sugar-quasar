// Quasar wrappers module
declare module 'quasar/wrappers' {
  export function configure<T>(callback: () => T): T;
  export function boot<T = unknown>(
    callback: (params: {
      app: import('vue').App;
      router: import('vue-router').Router;
      store: import('pinia').Pinia;
      ssrContext?: unknown;
      urlPath: string;
      publicPath: string;
      redirect: (url: string) => void;
    }) => void | Promise<void>
  ): T;
  export function route<T = unknown>(
    callback: (params: {
      to: import('vue-router').RouteLocationNormalized;
      from: import('vue-router').RouteLocationNormalized;
      next: () => void;
      redirect: (path: string) => void;
    }) => void
  ): T;
}
