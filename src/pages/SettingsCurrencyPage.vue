<template>
  <q-page class="q-pa-md">
    <page-header
      title="Monedas"
      parent-label="Configuración"
      :parent-to="{ name: 'settings' }"
      :user-name="user?.email ?? ''"
    />
    <!-- MONEDA PRINCIPAL -->
    <q-section class="q-mt-lg">
      <div class="text-h6 q-mb-xs">MONEDA PRINCIPAL</div>
      <div class="text-body2 text-bold q-mb-sm q-pt-md">
        Todas las conversiones se hacen en esta moneda
      </div>

      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="primaryCurrencyCode"
            :options="currencyOptions"
            option-label="label"
            option-value="shortName"
            emit-value
            map-options
            outlined
            dense
          />
        </div>
      </div>
    </q-section>

    <q-separator class="q-my-lg" />

    <!-- TIPOS DE MONEDA -->
    <q-section>
      <div class="row items-center q-mb-sm">
        <div class="col">
          <div class="text-h6">TIPOS DE MONEDA</div>
        </div>
        <div class="col-auto">
          <q-btn outline dense no-caps icon="add" label="Nueva" @click="onAddCurrency" />
          <NewCurrencyDialog v-model="openNewCurrencyDialog" @created="onCurrencyCreated" />
        </div>
      </div>

      <q-card flat bordered>
        <q-table
          flat
          :rows="currencies"
          :columns="currencyColumns"
          row-key="shortName"
          hide-pagination
          :rows-per-page-options="[0]"
          class="q-pa-sm"
        >
          <template #body-cell-shortName="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.shortName }}</div>
            </q-td>
          </template>

          <template #body-cell-name="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.name }}</div>
              <div class="text-caption text-grey-7">Símbolo: {{ props.row.symbol }}</div>
            </q-td>
          </template>

          <template #body-cell-primary="props">
            <q-td :props="props">
              <div v-if="props.row.shortName === primaryCurrencyCode" class="text-body2">
                * Principal
              </div>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn flat dense round icon="edit" @click="onEditCurrency()" />
              <NewCurrencyDialog v-model="openEditCurrencyDialog" :currency="props.row" />
              <q-btn
                v-if="props.row.shortName !== primaryCurrencyCode"
                flat
                dense
                round
                icon="delete"
                @click="onDeleteCurrency(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </q-section>

    <q-separator class="q-my-lg" />

    <!-- TASAS DE CAMBIO -->
    <q-section>
      <div class="row items-center q-mb-sm">
        <div class="col">
          <div class="text-h6">TASAS DE CAMBIO</div>
        </div>
        <div class="col-auto">
          <q-btn outline dense no-caps icon="add" label="Nueva" @click="onAddRate" />
          <NewExchangeRateDialog
            v-model="openNewExchangeRateDialog"
            :default-to="primaryCurrencyCode ?? undefined"
          />
        </div>
      </div>

      <q-card flat bordered>
        <q-table
          flat
          :rows="exchangeRates"
          :columns="rateColumns"
          row-key="id"
          hide-pagination
          :rows-per-page-options="[0]"
          class="q-pa-sm"
        >
          <template #body-cell-currency="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.row.currencyTypeId }}</div>
            </q-td>
          </template>
          <template #body-cell-rate="props">
            <q-td :props="props">
              {{ formatRate(props.row.factor) }}
            </q-td>
          </template>

          <template #body-cell-effectiveFrom="props">
            <q-td :props="props">
              {{ formatDateShort(props.row.effectiveFrom) }}
            </q-td>
          </template>
        </q-table>
      </q-card>

      <div class="text-caption text-grey-7 q-mt-sm">
        <q-icon name="info" class="q-mr-xs" />
        Las tasas anteriores se guardan como historial
      </div>

      <div class="q-mt-sm">
        <q-btn outline dense no-caps label="Ver historial de tasas" @click="onViewRateHistory" />
      </div>
    </q-section>

    <!-- Footer actions -->
    <div class="row items-center justify-end q-gutter-sm q-mt-xl">
      <q-btn outline no-caps label="Cancelar" @click="onCancel" />
      <q-btn color="primary" no-caps label="Guardar cambios" @click="onSave" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import NewCurrencyDialog from 'src/components/NewCurrencyDialog.vue';
import { useSupabase } from 'src/stores/supabase';
import { ref, computed } from 'vue';
import { useCurrencies } from 'src/stores/currencies';

const { currencies, primaryCurrencyShortName, exchangeRates } = useCurrencies();

type Currency = {
  shortName: string;
  name: string;
  symbol: string;
};

const supabase = useSupabase();
const user = supabase.user;

const openNewCurrencyDialog = ref(false);
const openEditCurrencyDialog = ref(false);
const openNewExchangeRateDialog = ref(false);

const primaryCurrencyCode = ref<string>(primaryCurrencyShortName ?? 'CUP');

const currencyOptions = computed(() =>
  currencies.map((c) => ({
    shortName: c.shortName,
    label: `${c.shortName} - ${c.name}`,
  })),
);

// Tables
const currencyColumns = [
  { name: 'shortName', label: '', field: 'shortName', align: 'left' as const },
  { name: 'name', label: '', field: 'name', align: 'left' as const },
  { name: 'primary', label: '', field: 'primary', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const },
];

const rateColumns = [
  { name: 'currency', label: 'Moneda', field: 'from', align: 'left' as const },
  { name: 'rate', label: 'Tasa', field: 'factor', align: 'left' as const },
  { name: 'effectiveFrom', label: 'Vigente desde', field: 'effectiveFrom', align: 'left' as const },
];

function formatDateShort(d: Date) {
  // Ej: "10 enero 2025"
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

function formatRate(n: number) {
  // 410 / 485 sin decimales en el mock
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n);
}

// Actions (stubs)

function onAddCurrency() {
  openNewCurrencyDialog.value = true;
  console.log('Add currency');
}
function onCurrencyCreated() {
  console.log('Currency created');
}
function onEditCurrency() {
  openEditCurrencyDialog.value = true;
  console.log('Edit currency');
}
function onDeleteCurrency(row: Currency) {
  console.log('Delete currency', row);
}
function onAddRate() {
  openNewExchangeRateDialog.value = true;
  console.log('Add rate');
}
function onViewRateHistory() {
  console.log('View rate history');
}
function onCancel() {
  console.log('Cancel');
}
function onSave() {
  console.log('Save changes', {
    primaryCurrencyCode: primaryCurrencyCode,
    currencies: currencies,
    rates: exchangeRates,
  });
}
</script>
