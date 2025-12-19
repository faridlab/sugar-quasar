import { configure } from 'quasar/wrappers';
import path from 'path';

export default configure(() => {
  return {
    boot: ['i18n', 'axios', 'pinia', 'query'],

    css: ['app.scss'],

    extras: ['roboto-font', 'material-icons', 'bootstrap-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },
      vueRouterMode: 'history',
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@domain': path.resolve(__dirname, 'src/domain'),
        '@application': path.resolve(__dirname, 'src/application'),
        '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
        '@presentation': path.resolve(__dirname, 'src/presentation'),
        '@shared': path.resolve(__dirname, 'src/shared'),
      },
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},
      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'LoadingBar',
        'LocalStorage',
        'SessionStorage',
        'Cookies',
        'Meta',
      ],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ['render'],
    },

    pwa: {
      workboxMode: 'GenerateSW',
    },

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
    },

    bex: {
      contentScripts: ['my-content-script'],
    },
  };
});
