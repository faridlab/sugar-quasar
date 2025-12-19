import { boot } from 'quasar/wrappers';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default boot(({ app }) => {
  app.use(VueQueryPlugin, { queryClient });
});

export { queryClient };
