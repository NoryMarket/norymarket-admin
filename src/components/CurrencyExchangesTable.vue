<template>
  <q-table
    flat
    :rows="currencies.currencyExchanges"
    :columns="currencyColumns"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    class="q-pa-sm table"
    :selection="confirmDeletion ? 'multiple' : 'none'"
    v-model:selected="selected"
  >
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ $gettext('Currencies exchanges') }}</label>
        <div class="row q-gutter-md">
          <template v-if="!confirmDeletion">
            <QBtn :label="$gettext('New currency exchange')" @click="creating = true" />
            <QBtn
              :label="$gettext('Delete currencies exchanges')"
              @click="confirmDeletion = true"
            />
          </template>
          <template v-if="confirmDeletion">
            <QBtn flat :label="$gettext('Cancel')" @click="cancelDeletion" :disable="deleting" />
            <QBtn
              :label="$gettext('Confirm')"
              @click="deleteSelected"
              :disable="!selected.length || deleting"
              :loading="deleting"
            />
          </template>
        </div>
      </div>
    </template>

    <template v-slot:bottom>
      <div class="text-caption text-grey-7 q-mt-sm">
        <q-icon name="info" class="q-mr-xs" />
        {{ $gettext('Previous exchanges are saved in the history') }}
      </div>

      <div class="q-mt-sm">
        <QBtn flat dense />
      </div>
    </template>
  </q-table>
  <CurrencyExchangesDialog :open="creating" @close="creating = false" />
</template>

<script setup lang="ts">
import moment from 'moment';

import { useCurrencies } from 'src/stores/currencies';
import { computed, ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import CurrencyExchangesDialog from './CurrencyExchangesDialog.vue';
import { useAppConfig } from 'src/stores/appConfig';
import type { QTableColumn } from 'quasar';
import type { CurrencyExchangeDTO } from 'src/api/api';

const currencies = useCurrencies();
const selected = ref([]);
const { $gettext } = useGettext();
const creating = ref(false);
const confirmDeletion = ref(false);
const appConfig = useAppConfig();
const deleting = ref(false);

const reference = computed(() =>
  appConfig.appConfig['default-currency']
    ? currencies.getCurrencyTypeById(appConfig.appConfig['default-currency'])
    : null,
);

const currencyColumns = computed<QTableColumn<CurrencyExchangeDTO>[]>(() => [
  {
    name: 'currency',
    label: $gettext('Currency'),
    field: 'currencyTypeId',
    format: (id: string) => currencies.getCurrencyTypeById(id)?.shortName ?? id,
  },
  {
    name: 'factor',
    label: reference.value
      ? $gettext('Relative value with: "%{reference}" ', { reference: reference.value?.shortName })
      : $gettext('Value'),
    field: 'factor',
    format: (factor, row) =>
      factor && reference.value
        ? (currencies
            .getRelativeExchangeValue(row.currencyTypeId, reference.value.id)
            ?.toString() ?? '')
        : '',
  },
  {
    name: 'updatedAt',
    label: $gettext('Last update'),
    field: 'updatedAt',
    format: (date) => (!date ? '' : moment(date).fromNow()),
  },
]);

const cancelDeletion = () => {
  selected.value = [];
  confirmDeletion.value = false;
};

const deleteSelected = async () => {
  if (selected.value.length > 0) {
    deleting.value = true;
    await currencies.deleteCurrencyExchanges(selected.value.map(({ id }) => id));
    deleting.value = false;
  }

  cancelDeletion();
};
</script>

<style lang="scss" scoped>
.table {
  max-height: 60vh;
}
</style>
