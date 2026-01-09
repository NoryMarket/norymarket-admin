<template>
  <q-drawer v-model="config.isLeftSidebarOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> {{ $gettext('Sections') }} </q-item-label>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { useGlobalConfig } from 'src/stores/globalConfig';

const config = useGlobalConfig();
</script>
