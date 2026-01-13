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
          <PrimaryCurrencyTypeInput />
        </div>
      </div>
    </q-section>
    <q-separator class="q-my-lg" />
    <!-- TIPOS DE MONEDA -->
    <q-section>
      <CurrencyTypesTable />
    </q-section>
    <q-separator class="q-my-lg" />
    <!-- TASAS DE CAMBIO -->
    <q-section>
      <CurrencyExchangesTable />
    </q-section>
  </q-page>
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import { useSupabase } from 'src/stores/supabase';

import PrimaryCurrencyTypeInput from 'src/components/PrimaryCurrencyTypeInput.vue';
import CurrencyTypesTable from 'src/components/CurrencyTypesTable.vue';
import CurrencyExchangesTable from 'src/components/CurrencyExchangesTable.vue';

const supabase = useSupabase();
//TODO: Is necesary showing user information here?, is already shown in the app header
const user = supabase.user;
</script>
