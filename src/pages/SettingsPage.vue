<script setup lang="ts">
import { useRouter } from 'vue-router';

type SettingsCard = {
  key: string;
  title: string;
  subtitle?: string;
  example?: string;
  icon: string;
  to: string;
};

const router = useRouter();

async function go(to: string) {
  await router.push({
    path: to,
  });
}

const items: SettingsCard[] = [
  {
    key: 'general',
    title: 'General',
    subtitle: 'Nombre, Logo, Información básica',
    icon: 'apartment',
    to: '/settings/general',
  },
  {
    key: 'currencies',
    title: 'Monedas',
    subtitle: 'Tipos de cambio, Moneda principal',
    icon: 'paid',
    to: '/settings/currency',
  },
  {
    key: 'units',
    title: 'Unidades de Medida',

    example: 'ml, unidades, hoja , metros',
    icon: 'square_foot',
    to: '/settings/quantity-unit',
  },
  {
    key: 'sizes',
    title: 'Tamaños',

    example: '11oz, S, M, L, XL',
    icon: 'straighten',
    to: '/settings/sizes',
  },
  {
    key: 'colors',
    title: 'Colores',
    example: 'azul, verde, blanco, negro',
    icon: 'palette',
    to: '/settings/colors',
  },
  {
    key: 'users',
    title: 'Usuarios',
    subtitle: 'Cuentas, Roles, Permisos',
    icon: 'group',
    to: '/settings/users',
  },
];
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md">
      <div class="row q-col-gutter-lg">
        <div v-for="item in items" :key="item.key" class="col-12 col-sm-6 col-md-4">
          <q-card class="settings-card cursor-pointer" flat bordered @click="go(item.to)">
            <q-card-section class="q-pb-sm">
              <div class="row items-start no-wrap">
                <q-icon :name="item.icon" size="42px" class="q-mr-md q-mt-xs" />
                <div>
                  <div class="text-h4 text-weight-bold">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-body1">
                {{ item.subtitle }}
              </div>

              <div v-if="item.example" class="text-body2 q-mt-md text-italic">
                {{ item.example }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.settings-card {
  border-radius: 12px;
  min-height: 220px;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;
}

.settings-card:hover {
  transform: translateY(-2px);
}

.text-h4 {
  line-height: 1.05;
}
.settings-card {
  border-width: 2px;
}
</style>
