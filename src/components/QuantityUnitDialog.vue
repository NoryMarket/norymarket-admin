<template>
  <QDialog :model-value="$props.open" @hide="close" persistent class="row no-wrap"
    ><QCard class="q-pa-md">
      <QCardSection>
        <label class="text-h6">{{
          creating ? $gettext('Create quantity unit') : $gettext('Update quantity unit')
        }}</label>
      </QCardSection>
      <QCardSection class="column q-gutter-y-sm column">
        <QInput :label="$gettext('Name')" v-model="name" />
        <QInput :label="$gettext('Abbreviation / Symbol')" v-model="shortName" />
        <QInput :label="$gettext('Description')" v-model="description" />
        <QCheckbox
          :label="$gettext('Allow Decimals (quantities like 0.5)')"
          v-model="allowDecimals"
        />
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
import type { QuantityUnitDto } from 'src/api/api';
import { useQuantityUnits } from 'src/stores/quantity-unit';
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import z from 'zod';

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    shortName: z.string().min(1),
    description: z.string().optional(),
    allowDecimals: z.boolean(),
  }),
);

const initialValues: Partial<QuantityUnitDto> = {
  name: '',
  shortName: '',
  description: '',
  allowDecimals: false,
};

const { setValues, meta, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues,
});

const [name] = defineField('name');
const [shortName] = defineField('shortName');
const [description] = defineField('description');
const [allowDecimals] = defineField('allowDecimals');
const processing = ref(false);

const quantityUnits = useQuantityUnits();

const props = defineProps<{
  open: boolean;
  data?: Partial<QuantityUnitDto>;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [QuantityUnitDto];
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
    const result = await quantityUnits.createQuantityUnit({
      name: name.value as string,
      shortName: shortName.value as string,
      description: description.value as string,
      allowDecimals: allowDecimals.value as boolean,
    });
    processing.value = false;
    if (result) {
      resetForm();
      emit('confirm', result);
    }
  } else {
    if (!props.data) return;
    processing.value = true;
    const result = await quantityUnits.updateQuantityUnit(props.data.id as string, {
      name: name.value as string,
      shortName: shortName.value as string,
      description: description.value as string,
      allowDecimals: allowDecimals.value as boolean,
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
