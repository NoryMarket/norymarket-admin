<template>
  <QTable
    flat
    :rows="colors.colors"
    :columns="colorColumns"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    class="q-pa-sm table"
    :selection="confirmDeletion ? 'multiple' : 'none'"
    v-model:selected="selected"
  >
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ $gettext('Colors') }}</label>
        <div class="row q-gutter-md">
          <template v-if="!confirmDeletion">
            <QBtn :label="$gettext('New color')" @click="color = {}" />
            <QBtn :label="$gettext('Delete colors')" @click="confirmDeletion = true" />
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
        <QBtn :disable="confirmDeletion" icon="edit" flat dense @click="color = props.row" />
      </q-td>
    </template>

    <template v-slot:bottom>
      <div class="q-mt-sm">
        <QBtn flat dense />
      </div>
    </template>
  </QTable>
  <ColorsDialog :open="!!color" :data="color!!" @close="closeDialog" @confirm="closeDialog" />
</template>

<script setup lang="ts">
import { useColors } from 'src/stores/colors';
import { computed, ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import ColorsDialog from './ColorsDialog.vue';

import type { QTableColumn } from 'quasar';
import type { ColorDTO } from 'src/api/api';

const colors = useColors();
const selected = ref<ColorDTO[]>([]);
const { $gettext } = useGettext();
const confirmDeletion = ref(false);
const deleting = ref(false);
const color = ref<Partial<ColorDTO> | undefined>();

type ColorTableRow = ColorDTO & {
  usedInProducts: number;
};

const colorColumns = computed<QTableColumn<ColorTableRow>[]>(() => [
  {
    name: 'name',
    label: $gettext('Color name'),
    field: 'name',
    format: (name: string) => name,
  },
  {
    name: 'color',
    label: $gettext('Color'),
    field: 'color',
    format: (color: string) => color,
  },
  {
    name: 'usedInProducts',
    label: $gettext('Used in insumes'),
    field: 'usedInProducts',
    format: (usedInProducts: number) => String(usedInProducts ?? 0),
  },
  { name: 'actions', label: '', field: 'id' },
]);

const cancelDeletion = () => {
  selected.value = [];
  confirmDeletion.value = false;
};

//TODO: Solo poder borrar colores q no esten siendo usandos en ningun insumo
const deleteSelected = async () => {
  if (selected.value.length > 0) {
    deleting.value = true;
    await colors.deleteColors(selected.value.map(({ id }) => id));
    deleting.value = false;
  }

  cancelDeletion();
};

const closeDialog = () => {
  color.value = undefined;
};
</script>

<style lang="scss" scoped>
.table {
  max-height: 60vh;
}
</style>
