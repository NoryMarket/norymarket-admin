import { boot } from 'quasar/wrappers';
import { Api } from 'src/api/api';
import { createApiPlugin } from 'src/api/plugin.vue';

export default boot(({ app }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const apiClient = new Api({
    baseUrl: apiUrl,
    securityWorker: (token: string | null) =>
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {},
  });

  app.use(createApiPlugin(apiClient));
});
