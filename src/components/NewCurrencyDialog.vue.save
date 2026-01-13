<!-- src/components/currency/CurrencyDialog.vue -->
<template>
  <q-dialog v-model="model" persistent>
    <q-card class="dialog-card">
      <!-- Header -->
      <q-card-section class="row items-center q-py-md">
        <div class="text-h6">{{ isEdit ? 'Editar moneda' : 'Nueva Moneda' }}</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="onCancel" />
      </q-card-section>

      <q-separator />

      <!-- Body -->
      <q-card-section class="q-pa-lg">
        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Código ISO</div>
          <q-input
            v-model.trim="form.shortName"
            outlined
            dense
            maxlength="3"
            counter
            placeholder="USD"
            :rules="shortNameRules"
            @update:model-value="onShortNameInput"
          />
          <div class="text-caption text-grey-7 q-mt-xs">3 letras (ej: USD, EUR, CUP)</div>
        </div>

        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Nombre</div>
          <q-input
            v-model.trim="form.name"
            outlined
            dense
            placeholder="Dólar Americano"
            :rules="requiredRules"
          />
        </div>

        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Símbolo</div>
          <q-input
            v-model.trim="form.symbol"
            outlined
            dense
            maxlength="5"
            placeholder="$"
            :rules="requiredRules"
          />
        </div>

        <!-- Si tu backend NO usa symbolPosition, puedes borrar este bloque -->
        <div class="field-block">
          <div class="text-subtitle2 q-mb-sm">Posición del símbolo</div>
          <q-option-group
            v-model="form.symbolPosition"
            :options="symbolPositionOptions"
            type="radio"
            inline
          />
        </div>

        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Decimales</div>
          <q-select
            v-model="form.decimals"
            outlined
            dense
            :options="decimalOptions"
            emit-value
            map-options
          />
        </div>
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right" class="q-pa-lg q-gutter-sm">
        <q-btn outline no-caps label="Cancelar" :disable="saving" @click="onCancel" />
        <q-btn
          color="primary"
          no-caps
          :label="isEdit ? 'Guardar cambios' : 'Guardar cambios'"
          :loading="saving"
          :disable="!isValid"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useCurrencies } from 'src/stores/currencies';
import type { CreateCurrencyTypeDTO, CurrencyTypeDTO, UpdateCurrencyTypeDTO } from 'src/api/api';

type SymbolPosition = 'BEFORE' | 'AFTER';

type CurrencyForm = {
  shortName: string;
  name: string;
  symbol: string;
  symbolPosition: SymbolPosition;
  decimals: number;
};

type Props = {
  modelValue: boolean;

  currency?: CurrencyTypeDTO | null;
};

const props = withDefaults(defineProps<Props>(), {
  currency: null,
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'created'): void;
  (e: 'updated'): void;
}>();

const store = useCurrencies();

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const isEdit = computed(() => !!props.currency);
const saving = computed(() => store.creatingCurrency || store.updatingCurrency);

// Form state
const form = reactive<CurrencyForm>({
  shortName: '',
  name: '',
  symbol: '',
  symbolPosition: 'BEFORE',
  decimals: 2,
});

const symbolPositionOptions = [
  { label: 'Antes del monto $ 100.00', value: 'BEFORE' },
  { label: 'Después del monto 100.00 $', value: 'AFTER' },
];

const decimalOptions = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

// Rules
const requiredRules = [(v: string) => !!(v ?? '').trim() || 'Requerido'];
const shortNameRules = [
  (v: string) => !!(v ?? '').trim() || 'Requerido',
  (v: string) => (v ?? '').trim().length === 3 || 'Debe tener 3 letras',
  (v: string) => /^[A-Z]{3}$/.test((v ?? '').trim()) || 'Solo letras A-Z (mayúsculas)',
];

// Keep ISO shortName uppercase and letters only
function onShortNameInput(v: string | number | null) {
  const s = String(v ?? '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3);
  form.shortName = s;
}

const isValid = computed(() => {
  const shortName = form.shortName.trim();
  const name = form.name.trim();
  const symbol = form.symbol.trim();
  return /^[A-Z]{3}$/.test(shortName) && name.length > 0 && symbol.length > 0;
});

function hydrateFromCurrency(c: CurrencyTypeDTO) {
  form.shortName = (c.shortName ?? '').toUpperCase();
  form.name = c.name ?? '';
  form.symbol = c.symbol ?? '';
  form.decimals = c.decimals ?? 2;

  form.symbolPosition = 'BEFORE';
}

function resetForm() {
  if (props.currency) {
    hydrateFromCurrency(props.currency);
  } else {
    form.shortName = '';
    form.name = '';
    form.symbol = '';
    form.symbolPosition = 'BEFORE';
    form.decimals = 2;
  }
}

function onCancel() {
  model.value = false;
}

async function onSave() {
  if (!isValid.value) return;

  if (!isEdit.value) {
    // CREATE
    const payload: CreateCurrencyTypeDTO = {
      shortName: form.shortName.trim(),
      name: form.name.trim(),
      symbol: form.symbol.trim(),
      decimals: form.decimals,
    };

    const res = await store.createCurrency(payload);
    if (!res?.ok) return;

    emit('created');
    model.value = false;
    return;
  }

  // UPDATE
  if (!props.currency) return;

  const payload: UpdateCurrencyTypeDTO = {
    shortName: form.shortName.trim(),
    name: form.name.trim(),
    symbol: form.symbol.trim(),
    decimals: form.decimals,
  };

  const res = await store.updateCurrency(props.currency.id, payload);
  if (!res?.ok) return;

  emit('updated');
  model.value = false;
}

// Init when opens
watch(
  () => model.value,
  (open) => {
    if (open) resetForm();
  },
);

// If record changes while open
watch(
  () => props.currency,
  () => {
    if (model.value) resetForm();
  },
);
</script>

<style scoped>
.dialog-card {
  width: 820px;
  max-width: 92vw;
}
.field-block {
  margin-bottom: 22px;
}
</style>
