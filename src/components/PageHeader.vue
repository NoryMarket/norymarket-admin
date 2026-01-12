<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type Props = {
  title: string;
  parentLabel?: string;
  parentTo?: RouteLocationRaw;
  showGreeting?: boolean;
  userName?: string;
  date?: Date;
  locale?: string;
};

const props = withDefaults(defineProps<Props>(), {
  showGreeting: true,
  locale: 'es-ES',
});

const hasParent = computed(() => !!props.parentLabel && !!props.parentTo);

const now = computed(() => props.date ?? new Date());

const greeting = computed(() => {
  const h = now.value.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
});

const greetingLine = computed(() => {
  const name = (props.userName ?? '').trim();
  return name ? `${greeting.value}, ${name}` : `${greeting.value}`;
});

const formattedDate = computed(() => {
  // Example: "Hoy: domingo 12 de enero del 2025"
  const fmt = new Intl.DateTimeFormat(props.locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Capitalize first letter (Spanish weekdays are usually lowercase)
  const base = fmt.format(now.value);
  const cap = base.charAt(0).toUpperCase() + base.slice(1);

  return `Hoy: ${cap}`;
});
</script>

<template>
  <div class="q-pa-md page-header">
    <div class="row items-start">
      <!-- LEFT: Parent navigation -->
      <div class="col">
        <div v-if="hasParent" class="row items-center">
          <q-btn flat dense no-caps icon="arrow_back" :to="parentTo" class="q-pa-none" />
          <q-btn flat dense no-caps :label="parentLabel" :to="parentTo" class="q-ml-xs q-pa-none" />
        </div>
      </div>

      <!-- RIGHT: Title + greeting/date -->
      <div class="col-auto text-right">
        <div class="text-h4 text-weight-medium">
          {{ title }}
        </div>

        <div class="text-body2 q-mt-xs">
          {{ greetingLine }}
        </div>

        <div class="text-caption text-grey-7">
          {{ formattedDate }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
