<template>
  <QDialog :model-value="$props.open" @hide="close" persistent class="row no-wrap"
    ><QCard class="q-pa-md">
      <QCardSection>
        <label class="text-h6">{{
          creating ? $gettext('Create currency') : $gettext('Update currency')
        }}</label>
      </QCardSection>
      <QCardSection class="column q-gutter-y-sm column">
        <QInput :label="$gettext('Name')" v-model="name" />
        <QInput :label="$gettext('Shortname')" v-model="shortName" />
        <div class="row full-width no-wrap">
          <QInput :label="$gettext('Symbol')" v-model="symbol" class="full-width q-pr-sm" />
          <QInput
            :label="$gettext('Decimals')"
            :model-value="decimals"
            type="number"
            class="full-width q-pl-sm"
            @update:model-value="
              (val) => setFieldValue('decimals', val ? Number(val) : undefined, true)
            "
          />
        </div>
      </QCardSection>
      <QCardActions align="right">
        <QBtn
          flat
          color="negative"
          :label="$gettext('Cancel')"
          @click="close"
          :disable="procesing"
        />
        <QBtn
          :disable="!meta.valid || procesing || (!creating && !meta.dirty)"
          color="secondary"
          :label="$gettext('Confirm')"
          @click="submit"
          :loading="procesing"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import type { CurrencyTypeDTO } from 'src/api/api';
import { useCurrencies } from 'src/stores/currencies';
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import z from 'zod';

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    shortName: z.string().min(1),
    decimals: z.number().min(0),
    symbol: z.string().min(1),
  }),
);

const initialValues: Partial<CurrencyTypeDTO> = {
  name: '',
  decimals: 0,
  shortName: '',
  symbol: '',
};

const { setValues, meta, defineField, resetForm, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues,
});

const [name] = defineField('name');
const [decimals] = defineField('decimals');
const [shortName] = defineField('shortName');
const [symbol] = defineField('symbol');
const procesing = ref(false);

const currencies = useCurrencies();

const props = defineProps<{
  open: boolean;
  data: Partial<CurrencyTypeDTO>;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [CurrencyTypeDTO];
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
    procesing.value = true;
    const result = await currencies.createCurrencyType({
      name: name.value as string,
      decimals: Number(decimals.value),
      shortName: shortName.value as string,
      symbol: symbol.value as string,
    });
    procesing.value = false;
    if (result) {
      resetForm();
      emit('confirm', result);
    }
  } else {
    procesing.value = true;
    const result = await currencies.updateCurrencyType(props.data.id as string, {
      name: name.value as string,
      decimals: Number(decimals.value),
      shortName: shortName.value as string,
      symbol: symbol.value as string,
    });
    procesing.value = false;
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
