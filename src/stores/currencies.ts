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

  const getCurrencyTypeExchange = (id: string) =>
    currencyExchanges.value.find(({ currencyTypeId }) => currencyTypeId === id);

  const toPrecision = (value: number, precision = 2) => {
    const pow = Math.pow(10, precision);

    return Math.floor(value * pow) / pow;
  };

  const getRelativeExchangeValue = (from: string, reference: string, factor?: number) => {
    const referenceCurrency = getCurrencyTypeById(reference);
    const fromCurrency = getCurrencyTypeExchange(from);
    const referenceExchange = getCurrencyTypeExchange(reference);

    if (!referenceCurrency || !fromCurrency || !referenceExchange) return;

    const fromCurrencyFactor = factor ?? fromCurrency.factor;
    const { factor: referenceExchangeFactor } = referenceExchange;

    const relation = fromCurrencyFactor / referenceExchangeFactor;

    return toPrecision(relation, referenceCurrency.decimals);
  };

  const getRelativeExchangeFactor = (from: string, reference: string, value: number) => {
    const referenceCurrency = getCurrencyTypeById(reference);

    if (!referenceCurrency) return;

    const fromCurrencyExchange = getCurrencyTypeExchange(from);
    const referenceExchange = getCurrencyTypeExchange(reference);

    if (!fromCurrencyExchange || !referenceExchange) return 1;

    return value / referenceExchange.factor;
  };

  const createCurrencyExchange = async (currencyTypeId: string, factor: number) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerCreateCurrencyExchange({
        currencyTypeId,
        factor,
      }),
    );

    if (!data || error) return;

    const currentIndex = currencyExchanges.value.findIndex(
      (exchange) => currencyTypeId === exchange.currencyTypeId,
    );

    if (currentIndex === -1) currencyExchanges.value.push(data);
    else currencyExchanges.value.splice(currentIndex, 1, data);

    return data;
  };

  const deleteCurrencyExchanges = async (ids: string[]) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerDeleteCurrencyExchanges({
        ids,
      }),
    );

    if (!data || error) return;

    await loadCurrencyExchanges();

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
    getCurrencyTypeExchange,
    getRelativeExchangeValue,
    getRelativeExchangeFactor,
    createCurrencyExchange,
    deleteCurrencyExchanges,
  };
});
