<template>
  <QDialog :model-value="$props.open" @hide="close" persistent class="row no-wrap"
    ><QCard class="q-pa-md">
      <QCardSection>
        <label class="text-h6">{{
          creating ? $gettext('Create color') : $gettext('Update color')
        }}</label>
      </QCardSection>
      <QCardSection class="column q-gutter-y-sm column">
        <QInput :label="$gettext('Name')" v-model="name" />
        <q-input filled v-model="color" :label="$gettext('Color')">
          <template v-slot:prepend>
            <q-icon name="circle" :style="{ color: color }" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="color" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </QCardSection>
      <QCardActions align="right">
        <QBtn
          flat
          color="negative"
          :label="$gettext('Cancel')"
          @click="close"
          :disable="processing"
        />
        <QBtn
          :disable="!meta.valid || processing || (!creating && !meta.dirty)"
          color="secondary"
          :label="$gettext('Confirm')"
          @click="submit"
          :loading="processing"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import type { ColorDTO } from 'src/api/api';
import { useColors } from 'src/stores/colors';
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import z from 'zod';

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    color: z.string().min(1),
  }),
);

const initialValues: Partial<ColorDTO> = {
  name: '',
  color: '',
};

const { setValues, meta, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues,
});

const [name] = defineField('name');
const [color] = defineField('color');
const processing = ref(false);

const colors = useColors();

const props = defineProps<{
  open: boolean;
  data?: Partial<ColorDTO>;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [ColorDTO];
}>();

const creating = computed(() => !props.data?.id);

const close = () => {
  resetForm({
    values: initialValues,
  });
  emit('close');
};

watch(props, () => {
  if (props.data) {
    const clonedData = structuredClone({ ...props.data });
    if (props.data.id)
      resetForm({
        values: clonedData,
      });
    else setValues(clonedData);
  }
});

const submit = async () => {
  if (!meta.value.valid) return;

  if (creating.value) {
    processing.value = true;
    const result = await colors.createColor({
      name: name.value as string,
      color: color.value as string,
    });
    processing.value = false;
    if (result) {
      resetForm();
      emit('confirm', result);
    }
  } else {
    if (!props.data) return;
    processing.value = true;
    const result = await colors.updateColor(props.data.id as string, {
      name: name.value as string,
      color: color.value as string,
    });
    processing.value = false;
    if (result) {
      resetForm();
      emit('confirm', result);
    }
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
