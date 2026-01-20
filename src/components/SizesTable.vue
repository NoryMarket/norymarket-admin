<template>
  <QTable
    flat
    :rows="sizes.sizes"
    :columns="sizeColumns"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    class="q-pa-sm table"
    :selection="confirmDeletion ? 'multiple' : 'none'"
    v-model:selected="selected"
  >
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ $gettext('Sizes') }}</label>
        <div class="row q-gutter-md">
          <template v-if="!confirmDeletion">
            <QBtn :label="$gettext('New size')" @click="size = {}" />
            <QBtn :label="$gettext('Delete sizes')" @click="confirmDeletion = true" />
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
        <QBtn :disable="confirmDeletion" icon="edit" flat dense @click="size = props.row" />
      </q-td>
    </template>

    <template v-slot:bottom>
      <div class="q-mt-sm">
        <QBtn flat dense />
      </div>
    </template>
  </QTable>
  <SizesDialog :open="!!size" :data="size!!" @close="closeDialog" @confirm="closeDialog" />
</template>

<script setup lang="ts">
import { useSizes } from 'src/stores/sizes';
import { computed, ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import SizesDialog from './SizesDialog.vue';

import type { QTableColumn } from 'quasar';
import type { SizeDTO } from 'src/api/api';

const sizes = useSizes();
const selected = ref<SizeDTO[]>([]);
const { $gettext } = useGettext();
const confirmDeletion = ref(false);
const deleting = ref(false);
const size = ref<Partial<SizeDTO> | undefined>();

type SizeTableRow = SizeDTO & {
  usedInProducts: number;
};

const sizeColumns = computed<QTableColumn<SizeTableRow>[]>(() => [
  {
    name: 'name',
    label: $gettext('Size name'),
    field: 'name',
    format: (name: string) => name,
  },
  {
    name: 'shortName',
    label: $gettext('Description'),
    field: 'shortName',
    format: (shortName: string) => shortName,
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

//TODO: Solo poder borrar sizes q no esten siendo usandos en ningun insumo
const deleteSelected = async () => {
  if (selected.value.length > 0) {
    deleting.value = true;
    await sizes.deleteSizes(selected.value.map(({ id }) => id));
    deleting.value = false;
  }

  cancelDeletion();
};

const closeDialog = () => {
  size.value = undefined;
};
</script>

<style lang="scss" scoped>
.table {
  max-height: 60vh;
}
</style>
