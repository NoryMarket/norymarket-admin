import { ApiKey } from 'src/api/plugin.vue';
import { inject } from 'vue';

export const useApi = () => {
  const api = inject(ApiKey);
  if (!api) throw new Error('API not provided');
  return api;
};
