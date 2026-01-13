<template>
  <q-select
    :model-value="appConfig.appConfig['default-currency']"
    :options="currencies.currencyTypes"
    option-label="shortName"
    option-value="id"
    emit-value
    map-options
    outlined
    dense
    @update:model-value="onChange"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { useAppConfig } from 'src/stores/appConfig';
import { useCurrencies } from 'src/stores/currencies';
import { onMounted, ref } from 'vue';

const appConfig = useAppConfig();
const currencies = useCurrencies();
const loading = ref(false);

const onChange = async (id: string) => {
  const currency = currencies.getCurrencyTypeById(id);

  if (currency) {
    loading.value = true;
    await appConfig.setDefaultCurrencyType(currency);
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await currencies.load();
  loading.value = false;
});
</script>
