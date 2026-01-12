import { defineStore } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';

import type {
  CurrencyTypeDTO,
  CurrencyExchangeDTO,
  CreateCurrencyTypeDTO,
  UpdateCurrencyTypeDTO,
  CreateCurrencyExchangeDTO,
} from 'src/api/api';

// Helpers opcionales (si no los quieres, bórralos)
function replaceById<T extends { id: string }>(arr: T[], updated: T): T[] {
  const idx = arr.findIndex((x) => x.id === updated.id);
  if (idx === -1) return arr;
  const copy = arr.slice();
  copy[idx] = updated;
  return copy;
}

function removeByIds<T extends { id: string }>(arr: T[], ids: string[]): T[] {
  const set = new Set(ids);
  return arr.filter((x) => !set.has(x.id));
}

export const useCurrencies = defineStore('currencies', () => {
  const api = useApi();

  // -------------------------
  // State
  // -------------------------
  const currencies = ref<CurrencyTypeDTO[]>([]);
  const exchangeRates = ref<CurrencyExchangeDTO[]>([]);

  const primaryCurrencyShortName = ref<string | null>(null);

  const loading = ref(false);

  // CRUD loading
  const creatingCurrency = ref(false);
  const updatingCurrency = ref(false);
  const deletingCurrency = ref(false);

  const creatingRate = ref(false);

  const currencyOptions = computed(() =>
    currencies.value.map((c) => ({
      label: `${c.shortName} - ${c.name}`,
      value: c.shortName,
    })),
  );

  // -------------------------
  // Loaders
  // -------------------------
  const loadCurrencies = async () => {
    loading.value = true;
    try {
      const { data } = await safeRequest(() =>
        api.configuration.configurationControllerGetCurrencyType({
          secure: true,
        }),
      );
      console.log('Loaded currencies:', data);

      if (data) currencies.value = data;
    } finally {
      loading.value = false;
    }
  };

  const loadExchangeRates = async () => {
    loading.value = true;
    try {
      const { data } = await safeRequest(() =>
        api.configuration.configurationControllerGetCurrencyExchanges({
          secure: true,
        }),
      );

      if (data) exchangeRates.value = data;
    } finally {
      loading.value = false;
    }
  };

  // TODO: Hacerla async
  const loadCurrencySettings = () => {
    // TODO: endpoint para settings (moneda principal)
    // const { data } = await safeRequest(() =>
    //   api.configuration.configurationControllerGetCurrencySettings({
    //     secure: true,
    //   }),
    // );

    // if (data?.primaryCurrencyShortName) {
    //   primaryCurrencyShortName.value = data.primaryCurrencyShortName;
    // }
    //await console.log('test');
    primaryCurrencyShortName.value = 'CUP'; // Valor por defecto
  };

  const refreshAll = async () => {
    loadCurrencySettings();
    await Promise.all([loadCurrencies(), loadExchangeRates()]);
  };

  // -------------------------
  // Currency CRUD (API + state)
  // -------------------------
  const createCurrency = async (payload: CreateCurrencyTypeDTO) => {
    creatingCurrency.value = true;
    try {
      const { data, error } = await safeRequest(() => {
        console.log('Creating currency with payload:', payload);
        return api.configuration.configurationControllerCreateCurrencyType(payload);
      });

      if (error || !data) return { ok: false as const };

    
      currencies.value.unshift(data);

      return { ok: true as const, data };
    } finally {
      creatingCurrency.value = false;
    }
  };

  const updateCurrency = async (currencyId: string, payload: UpdateCurrencyTypeDTO) => {
    updatingCurrency.value = true;
    try {
      const { data, error } = await safeRequest(() =>
        api.configuration.configurationControllerUpdateCurrencyType(currencyId, payload),
      );

      if (error || !data) return { ok: false as const };

 
      currencies.value = replaceById(currencies.value, data);

      return { ok: true as const, data };
    } finally {
      updatingCurrency.value = false;
    }
  };

  const deleteCurrencies = async (currencyId: string) => {
    deletingCurrency.value = true;
    try {
      const { error } = await safeRequest(() =>
        api.configuration.configurationControllerDeleteCurrencyType(currencyId),
      );

      if (error) return { ok: false as const };

      currencies.value = removeByIds(currencies.value, [currencyId]);

      // Si borran la principal, limpia
      if (
        primaryCurrencyShortName.value &&
        currencies.value.every((c) => c.shortName !== primaryCurrencyShortName.value)
      ) {
        primaryCurrencyShortName.value = null;
      }

      return { ok: true as const };
    } finally {
      deletingCurrency.value = false;
    }
  };

  //TODO: Hacerla async
  const setPrimaryCurrency = (shortName: string) => {
    // TODO: endpoint para settings (moneda principal)
    // const { data, error } = await safeRequest(() =>
    //   api.configuration.configurationControllerSetPrimaryCurrency({ shortName }),
    // );

    // if (error || !data) return { ok: false as const };

    // primaryCurrencyShortName.value = shortName;
    // return { ok: true as const };
    console.log('Set primary currency to', shortName);
  };

  // Helpers locales
  const pushCurrency = (currency: CurrencyTypeDTO) => {
    currencies.value.unshift(currency);
  };

  const updateCurrencyLocal = (updated: CurrencyTypeDTO) => {
    currencies.value = replaceById(currencies.value, updated);
  };

  const deleteCurrenciesLocal = (id: string[]) => {
    currencies.value = removeByIds(currencies.value, id);
  };

  // -------------------------
  // Exchange Rate CRUD
  // -------------------------
  const createExchangeRate = async (payload: CreateCurrencyExchangeDTO) => {
    creatingRate.value = true;
    try {
      const { data, error } = await safeRequest(() =>
        api.configuration.configurationControllerCreateCurrencyExchange(payload),
      );

      if (error || !data) return { ok: false as const };

      exchangeRates.value.unshift(data);
      return { ok: true as const, data };
    } finally {
      creatingRate.value = false;
    }
  };

  // Helpers locales
  const pushRate = (rate: CurrencyExchangeDTO) => {
    exchangeRates.value.unshift(rate);
  };

  const updateRateLocal = (updated: CurrencyExchangeDTO) => {
    exchangeRates.value = replaceById(exchangeRates.value, updated);
  };

  const deleteRatesLocal = (ids: string[]) => {
    exchangeRates.value = removeByIds(exchangeRates.value, ids);
  };

  // -------------------------
  // Auto-load 
  // -------------------------
  onMounted(() => {
    void refreshAll();
  });

  return {
    // state
    currencies,
    exchangeRates,
    primaryCurrencyShortName,
    currencyOptions,

    // loading
    loading,
    creatingCurrency,
    updatingCurrency,
    deletingCurrency,
    creatingRate,

    // loaders
    loadCurrencies,
    loadExchangeRates,
    loadCurrencySettings,
    refreshAll,

    // currency crud
    createCurrency,
    updateCurrency,
    deleteCurrencies,
    setPrimaryCurrency,

    // rate crud
    createExchangeRate,

    // local helpers
    pushCurrency,
    updateCurrencyLocal,
    deleteCurrenciesLocal,
    pushRate,
    updateRateLocal,
    deleteRatesLocal,
  };
});
