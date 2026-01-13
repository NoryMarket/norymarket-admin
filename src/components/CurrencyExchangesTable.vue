<template>
  <q-table
    flat
    :rows="currencies.currencyExchanges"
    :columns="currencyColumns"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    class="q-pa-sm table"
  >
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ $gettext('Currencies exchanges') }}</label>
        <div class="row q-gutter-md">
          <template v-if="!confirmDeletion">
            <QBtn :label="$gettext('New currency exchange')" @click="exchange = {}" />
            <QBtn
              :label="
                $ngettext(
                  'Delete currency exchange',
                  'Delete currencies exchanges',
                  selected.length,
                )
              "
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

    <template #body-cell-actions="props">
      <q-td :props="props">
        <QBtn :disable="confirmDeletion" icon="edit" flat dense @click="exchange = props.row" />
      </q-td>
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
</template>

<script setup lang="ts">
import moment from 'moment';
import type { CurrencyExchangeDTO } from 'src/api/api';
// import { useAppConfig } from 'src/stores/appConfig';
import { useCurrencies } from 'src/stores/currencies';
import { ref } from 'vue';
import { useGettext } from 'vue3-gettext';

const currencies = useCurrencies();
const selected = ref([]);
const { $gettext } = useGettext();
const exchange = ref<Partial<CurrencyExchangeDTO>>();
const confirmDeletion = ref(false);
// const appConfig = useAppConfig();
const deleting = ref(false);

const currencyColumns = ref([
  {
    name: 'currency',
    label: $gettext('Currency'),
    field: 'currencyTypeId',
    format: (id: string) => currencies.getCurrencyTypeById(id)?.shortName ?? id,
  },
  { name: 'factor', label: $gettext('Value'), field: 'factor' },
  {
    name: 'updatedAt',
    label: $gettext('Last update'),
    field: 'updatedAt',
    format: (date) => (!date ? '' : moment(date).fromNow()),
  },
  { name: 'actions', label: '', field: 'id' },
]);

const cancelDeletion = () => {
  selected.value = [];
  confirmDeletion.value = false;
};

const deleteSelected = async () => {
  if (selected.value.length > 0) {
    deleting.value = true;
    await Promise.resolve(1);
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
