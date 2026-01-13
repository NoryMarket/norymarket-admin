import { defineStore } from 'pinia';
import type {
  CreateCurrencyTypeDTO,
  CurrencyExchangeDTO,
  CurrencyTypeDTO,
  UpdateCurrencyTypeDTO,
} from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { useAppConfig } from './appConfig';
import { useCachedResource } from 'src/composables/useCachedResource';

export const useCurrencies = defineStore('currencies', () => {
  const api = useApi();
  const appConfig = useAppConfig();

  const { data: currencyExchanges, load: loadCurrencyExchanges } = useCachedResource<
    CurrencyExchangeDTO[]
  >([], async () => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerGetCurrencyExchanges(),
    );

    return !data || error ? undefined : data;
  });

  const { data: currencyTypes, load: loadCurrencyTypes } = useCachedResource<CurrencyTypeDTO[]>(
    [],
    async () => {
      const { data, error } = await safeRequest(() =>
        api.configuration.configurationControllerGetCurrencyType(),
      );

      return !data || error ? undefined : data;
    },
  );

  const getCurrencyTypeById = (id: string) =>
    currencyTypes.value.find((currency) => currency.id === id);

  const load = async (force = false) => {
    await appConfig.load();
    await loadCurrencyTypes(force);
    await loadCurrencyExchanges(force);
  };

  const createCurrencyType = async (currency: CreateCurrencyTypeDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerCreateCurrencyType(currency),
    );

    if (!data || error) return;

    currencyTypes.value.unshift(data);

    return data;
  };

  const updateCurrencyType = async (id: string, currency: UpdateCurrencyTypeDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerUpdateCurrencyType(id, currency),
    );

    if (!data || error) return;

    const current = getCurrencyTypeById(id);

    if (!current) return;

    Object.assign(current, data);
    return data;
  };

  const deleteCurrencyTypes = async (ids: string[]) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerDeleteCurrencyType({
        ids,
      }),
    );

    if (!data || error) return;

    const removed = new Set(ids);

    currencyTypes.value = currencyTypes.value.filter(({ id }) => !removed.has(id));

    return ids;
  };

  return {
    currencyTypes,
    currencyExchanges,
    load,
    loadCurrencyTypes,
    loadCurrencyExchanges,
    getCurrencyTypeById,
    createCurrencyType,
    updateCurrencyType,
    deleteCurrencyTypes,
  };
});
