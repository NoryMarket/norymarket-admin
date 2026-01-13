<template>
  <q-table
    flat
    :rows="currencies.currencyTypes"
    :columns="currencyColumns"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    class="q-pa-sm table"
    :selection="confirmDeletion ? 'multiple' : 'none'"
    v-model:selected="selected"
    table-header-class="sticky"
  >
    <template #body-cell-actions="props">
      <q-td :props="props">
        <QBtn :disable="confirmDeletion" icon="edit" flat dense @click="currency = props.row" />
      </q-td>
    </template>
    <template #body-cell-decimals="props">
      <q-td :props="props">
        <div class="text-weight-medium">{{ props.row.decimals }}</div>
        <div class="text-caption text-grey-7">{{ formatDecimals(props.row.decimals) }}</div>
      </q-td>
    </template>
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ $gettext('Currencies') }}</label>
        <div class="row q-gutter-md">
          <template v-if="!confirmDeletion">
            <QBtn :label="$gettext('Create new currency')" @click="currency = {}" />
            <QBtn
              :label="$ngettext('Delete currency', 'Delete currencies', selected.length)"
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
  </q-table>
  <CurrencyTypeDialog
    :open="!!currency"
    :data="currency!!"
    @close="closeDialog"
    @confirm="closeDialog"
  />
</template>

<script setup lang="ts">
import type { CurrencyTypeDTO } from 'src/api/api';
import { useCurrencies } from 'src/stores/currencies';
import { onMounted, ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import CurrencyTypeDialog from './CurrencyTypeDialog.vue';

const currencies = useCurrencies();
const selected = ref([]);
const { $gettext } = useGettext();
const currency = ref<Partial<CurrencyTypeDTO> | null>(null);
const confirmDeletion = ref(false);
const deleting = ref(false);

const currencyColumns = ref([
  { name: 'name', label: $gettext('Name'), field: 'name' },
  { name: 'shortName', label: $gettext('Short name'), field: 'shortName' },
  { name: 'symbol', label: $gettext('Symbol'), field: 'symbol' },
  { name: 'decimals', label: $gettext('Decimals'), field: 'decimals' },
  { name: 'actions', label: '', field: 'id' },
]);

onMounted(async () => {
  await currencies.load();
});

const closeDialog = () => {
  currency.value = null;
};

const formatDecimals = (decimals: number) => {
  const chars = Array.from({ length: decimals }).map(() => '#');

  return decimals === 0 ? `#` : `#.${chars.join('')}`;
};

const cancelDeletion = () => {
  selected.value = [];
  confirmDeletion.value = false;
};

const deleteSelected = async () => {
  if (selected.value.length > 0) {
    deleting.value = true;
    await currencies.deleteCurrencyTypes(selected.value.map(({ id }) => id));
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
