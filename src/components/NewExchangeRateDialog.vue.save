<template>
  <q-dialog v-model="model" persistent>
    <q-card class="dialog-card">
      <!-- Header -->
      <q-card-section class="row items-center q-py-md">
        <div class="text-h6">Nueva tasa de cambio</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="onCancel" />
      </q-card-section>

      <q-separator />

      <!-- Body -->
      <q-card-section class="q-pa-lg">
        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Moneda origen</div>
          <q-select
            v-model="form.from"
            outlined
            dense
            :options="currencyOptions"
            emit-value
            map-options
            :rules="requiredSelectRules"
          />
          <div class="text-caption text-grey-7 q-mt-xs">3 letras (ej: USD, EUR, CUP)</div>
        </div>

        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Moneda destino</div>
          <q-select
            v-model="form.to"
            outlined
            dense
            :options="currencyOptions"
            emit-value
            map-options
            :rules="[...requiredSelectRules, differentCurrencyRule]"
          />
        </div>

        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Tasa de cambio</div>
          <q-input
            v-model="form.rate"
            outlined
            dense
            inputmode="decimal"
            placeholder="410"
            :rules="rateRules"
            @update:model-value="onRateInput"
          />
        </div>

        <div class="field-block">
          <div class="text-subtitle2 q-mb-xs">Vigente desde</div>

          <q-input
            v-model="form.effectiveFrom"
            outlined
            dense
            placeholder="DD / MMMM / YYYY"
            :rules="dateRules"
            readonly
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="form.effectiveFrom"
                    mask="YYYY-MM-DD"
                    :locale="qDateLocaleEs"
                    @update:model-value="onDatePicked"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="text-caption text-grey-7 q-mt-xs">
            <q-icon name="info" class="q-mr-xs" />
            Las tasas anteriores se guardan como historial
          </div>
        </div>
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right" class="q-pa-lg q-gutter-sm">
        <q-btn outline no-caps label="Cancelar" :disable="saving" @click="onCancel" />
        <q-btn
          color="primary"
          no-caps
          label="Guardar cambios"
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
// import { CreateCurrencyExchangeDTO } from 'src/api/api';

type Props = {
  modelValue: boolean;
  /** opcional: forzar el destino a la moneda principal */
  defaultTo?: string;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'created'): void;
}>();

const store = useCurrencies();

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const saving = computed(() => store.creatingRate);

const currencyOptions = computed(() =>
  store.currencies.map((c) => ({
    label: c.shortName,
    value: c.shortName,
  })),
);

// const decimalOptions = [
//   { label: '0', value: 0 },
//   { label: '1', value: 1 },
//   { label: '2', value: 2 },
//   { label: '3', value: 3 },
//   { label: '4', value: 4 },
// ];

// QDate locale (meses en español)
const qDateLocaleEs = {
  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

type FormState = {
  from: string;
  to: string;
  rate: string;
  effectiveFrom: string; // YYYY-MM-DD (mask de QDate)
};

const form = reactive<FormState>({
  from: '',
  to: props.defaultTo ?? store.primaryCurrencyShortName ?? '',
  rate: '',
  effectiveFrom: '', // YYYY-MM-DD
});

// ---------- Rules ----------
const requiredSelectRules = [(v: string) => !!(v ?? '').trim() || 'Requerido'];

const differentCurrencyRule = (v: string) =>
  !v || v !== form.from || 'Origen y destino no pueden ser iguales';

const rateRules = [
  (v: string) => !!(v ?? '').trim() || 'Requerido',
  (v: string) => {
    const n = Number(String(v).replace(',', '.'));
    return (Number.isFinite(n) && n > 0) || 'Debe ser un número mayor que 0';
  },
];

const dateRules = [(v: string) => !!(v ?? '').trim() || 'Requerido'];

// Limpia input de tasa (solo números + punto/coma)
function onRateInput(v: string | number | null) {
  const s = String(v ?? '')
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '.'); // normaliza a punto
  form.rate = s;
}

function onDatePicked() {
  // nada: form.effectiveFrom ya está en YYYY-MM-DD por el mask
}

// ---------- Validación final ----------
const isValid = computed(() => {
  const from = form.from.trim();
  const to = form.to.trim();
  if (!from || !to) return false;
  if (from === to) return false;

  const rateNum = Number(form.rate.replace(',', '.'));
  if (!Number.isFinite(rateNum) || rateNum <= 0) return false;

  if (!form.effectiveFrom.trim()) return false;
  return true;
});

// ---------- Actions ----------
function resetForm() {
  form.from = '';
  form.to = props.defaultTo ?? store.primaryCurrencyShortName ?? '';
  form.rate = '';
  form.effectiveFrom = '';
}

function onCancel() {
  model.value = false;
}

function onSave() {
  if (!isValid.value) return;

  // const payload: CreateCurrencyExchangeDTO = {
  //   factor: Number(form.rate.replace(',', '.')),
  //   currencyTypeId: //todo
  // };

  // const res = await store.createExchangeRate(payload as any);
  // if (!res?.ok) return;

  // emit('created');
  // model.value = false;
  // resetForm();
}

// Reset cuando cierre
watch(
  () => model.value,
  (open) => {
    if (!open) resetForm();
  },
);

// Si cambian monedas disponibles / principal, rellena destino si está vacío
watch(
  () => store.primaryCurrencyShortName,
  (code) => {
    if (!props.defaultTo && (!form.to || !currencyOptions.value.some((o) => o.value === form.to))) {
      form.to = code ?? '';
    }
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
