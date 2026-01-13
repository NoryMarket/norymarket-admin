import { defineStore } from 'pinia';
import type { AppConfigurationDto, CurrencyTypeDTO } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { reactive, ref } from 'vue';

export const useAppConfig = defineStore('appConfig', () => {
  const api = useApi();
  const appConfig = reactive<Partial<AppConfigurationDto>>({});
  const ready = ref(false);

  const load = async (force = false) => {
    if (!force && ready.value) return;

    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerGetAppConfiguration(),
    );

    if (!data || error) return;

    Object.assign(appConfig, data);
    ready.value = true;
  };

  const setDefaultCurrencyType = async ({ id }: CurrencyTypeDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerSetAppConfiguration({
        'default-currency': id,
      }),
    );

    if (!data || error) return;

    appConfig['default-currency'] = id;
  };

  return { appConfig, load, setDefaultCurrencyType };
});
