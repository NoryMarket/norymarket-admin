<template>
  <QTable
    flat
    :rows="quantityUnits.quantityUnits"
    :columns="quantityUnitColumns"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    class="q-pa-sm table"
    :selection="confirmDeletion ? 'multiple' : 'none'"
    v-model:selected="selected"
  >
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ $gettext('Quantity Units') }}</label>
        <div class="row q-gutter-md">
          <template v-if="!confirmDeletion">
            <QBtn :label="$gettext('New quantity unit')" @click="quantityUnit = {}" />
            <QBtn :label="$gettext('Delete quantity units')" @click="confirmDeletion = true" />
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
    <template #body-cell-color="props">
      <q-td :props="props">
        <q-icon name="circle" :style="{ color: props.row.color }" />
      </q-td>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props">
        <QBtn :disable="confirmDeletion" icon="edit" flat dense @click="quantityUnit = props.row" />
      </q-td>
    </template>

    <template v-slot:bottom>
      <div class="q-mt-sm">
        <QBtn flat dense />
      </div>
    </template>
  </QTable>
  <QuantityUnitDialog
    :open="!!quantityUnit"
    :data="quantityUnit!!"
    @close="closeDialog"
    @confirm="closeDialog"
  />
</template>

<script setup lang="ts">
import { useQuantityUnits } from 'src/stores/quantity-unit';
import { computed, ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import QuantityUnitDialog from './QuantityUnitDialog.vue';

import type { QTableColumn } from 'quasar';
import type { QuantityUnitDto } from 'src/api/api';

const quantityUnits = useQuantityUnits();
const selected = ref<QuantityUnitDto[]>([]);
const { $gettext } = useGettext();
const confirmDeletion = ref(false);
const deleting = ref(false);
const quantityUnit = ref<Partial<QuantityUnitDto> | undefined>();

type QuantityUnitTableRow = QuantityUnitDto & {
  usedInProducts: number;
};

const quantityUnitColumns = computed<QTableColumn<QuantityUnitTableRow>[]>(() => [
  {
    name: 'name',
    label: $gettext('Name'),
    field: 'name',
    format: (name: string) => name,
  },
  {
    name: 'shortName',
    label: $gettext('Symbol'),
    field: 'shortName',
    format: (shortName: string) => shortName,
  },
  {
    name: 'description',
    label: $gettext('Description'),
    field: 'description',
    format: (description: string) => description,
  },
  {
    name: 'allowDecimals',
    label: $gettext('Allow decimals'),
    field: 'allowDecimals',
    format: (allowDecimals: boolean) => (allowDecimals ? $gettext('Yes') : $gettext('No')),
  },
  {
    name: 'usedInProducts',
    label: $gettext('Used in products'),
    field: 'usedInProducts',
    format: (usedInProducts: number) => String(usedInProducts ?? 0),
  },
  { name: 'actions', label: '', field: 'id' },
]);

const cancelDeletion = () => {
  selected.value = [];
  confirmDeletion.value = false;
};

//TODO: Solo poder borrar quantity-units q no esten siendo usandos en ningun insumo
const deleteSelected = async () => {
  if (selected.value.length > 0) {
    deleting.value = true;
    await quantityUnits.deleteQuantityUnits(selected.value.map(({ id }) => id));
    deleting.value = false;
  }

  cancelDeletion();
};

const closeDialog = () => {
  quantityUnit.value = undefined;
};
</script>

<style lang="scss" scoped>
.table {
  max-height: 60vh;
}
</style>
