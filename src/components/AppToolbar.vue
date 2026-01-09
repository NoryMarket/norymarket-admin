<template>
  <q-toolbar>
    <q-btn flat dense round icon="menu" aria-label="Menu" @click="config.toggleIsLeftSidebarOpen" />

    <q-toolbar-title> {{ $gettext('NoryArt admin') }} </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useGlobalConfig } from 'src/stores/globalConfig';

const config = useGlobalConfig();
</script>
