<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated><AppToolbar /> </q-header>
    <LeftSidebar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppToolbar from 'src/components/AppToolbar.vue';
import LeftSidebar from 'src/components/LeftSidebar.vue';
</script>
