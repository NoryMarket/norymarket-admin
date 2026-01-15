<template>
  <QDialog :model-value="$props.open" @hide="close" persistent class="row no-wrap"
    ><QCard class="q-pa-md">
      <QCardSection>
        <label class="text-h6">{{ $gettext('Register currency exchange') }}</label>
      </QCardSection>
      <QCardSection class="column q-gutter-y-sm column">
        <div class="row full-width no-wrap">
          <QSelect
            :options="currencies.currencyTypes"
            v-model="currencyType"
            option-label="shortName"
            option-value="id"
            :label="$gettext('Currency')"
            class="col q-pr-sm"
          />
          <QSelect
            :options="currencies.currencyTypes"
            v-model="currencyTypeReference"
            option-label="shortName"
            option-value="id"
            :label="$gettext('Reference')"
            class="col q-pl-sm"
          />
        </div>
        <div class="row full-width no-wrap items-end justify-center">
          <div class="column full-width no-wrap col">
            <label class="col text-h6 text-center"
              >1 {{ currencyType?.shortName ?? '?' }} =
              {{
                currencyType &&
                currencyTypeReference &&
                currencyType.id === currencyTypeReference.id
                  ? 1
                  : currencyTypeReference && currencyType && value
                    ? value
                    : '?'
              }}
              {{ currencyTypeReference?.shortName ?? '?' }}</label
            >
          </div>
          <QInput
            :disable="
              currencyType && currencyTypeReference && currencyType.id === currencyTypeReference.id
            "
            :label="$gettext('Value')"
            class="col q-ml-md"
            v-model="value"
            :hint="previousValue ? `${$gettext('was')}: ${String(previousValue)}` : ''"
          />
        </div>
      </QCardSection>

      <QCardActions align="right">
        <QBtn
          flat
          color="negative"
          :label="$gettext('Cancel')"
          @click="close"
          :disable="creating"
        />
        <QBtn
          :disable="creating || !isValid"
          color="secondary"
          :label="$gettext('Confirm')"
          @click="submit"
          :loading="creating"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import type { CurrencyExchangeDTO, CurrencyTypeDTO } from 'src/api/api';
import { useAppConfig } from 'src/stores/appConfig';
import { useCurrencies } from 'src/stores/currencies';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [CurrencyExchangeDTO];
}>();

const currencies = useCurrencies();
const appConfig = useAppConfig();
const currencyType = ref<CurrencyTypeDTO>();
const currencyTypeReference = ref<CurrencyTypeDTO>();
const value = ref<number>();
const previousValue = ref<number>();
const creating = ref(false);

const factor = computed(() => {
  if (!value.value || !currencyType.value || !currencyTypeReference.value) return 0;

  return currencies.getRelativeExchangeFactor(
    currencyType.value.id,
    currencyTypeReference.value.id,
    value.value,
  );
});

watch(props, () => {
  if (props.open) {
    const defaultCurrency = appConfig.appConfig['default-currency'];
    const currency = defaultCurrency ? currencies.getCurrencyTypeById(defaultCurrency) : null;

    if (currency) currencyTypeReference.value = { ...currency };
  } else {
    currencyTypeReference.value = undefined;
  }
});

watch([currencyType, currencyTypeReference], () => {
  if (!currencyType.value || !currencyTypeReference.value) return;
  const exchange = currencies.getCurrencyTypeExchange(currencyType.value.id);
  const referenceExchange = currencies.getCurrencyTypeExchange(currencyTypeReference.value.id);

  if (!exchange || !referenceExchange) {
    value.value = 1;
    previousValue.value = undefined;
  } else {
    previousValue.value = currencies.getRelativeExchangeValue(
      exchange.currencyTypeId,
      referenceExchange.currencyTypeId,
    );
  }
});

const close = () => {
  currencyType.value = undefined;
  currencyTypeReference.value = undefined;
  previousValue.value = undefined;
  emit('close');
};

const isValid = computed(() => !!value.value && !isNaN(value.value));

const submit = async () => {
  if (
    !factor.value ||
    !currencyType.value ||
    currencies.getCurrencyTypeExchange(currencyType.value.id)?.factor === factor.value
  )
    return;

  creating.value = true;
  const created = await currencies.createCurrencyExchange(currencyType.value.id, factor.value);
  creating.value = false;

  if (created) {
    close();
    emit('confirm', created);
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: calc(100% * 10 / 12);
}

@media (min-width: $breakpoint-md-min) {
  .q-card {
    width: calc(100% * 6 / 12);
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-card {
    width: calc(100% * 4 / 12);
  }
}
</style>
