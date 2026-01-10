<template>
  <QDrawer v-model="config.isLeftSidebarOpen" show-if-above bordered>
    <QList class="full-height column">
      <QItem to="/index">Index</QItem>
      <QItem to="/users">Users</QItem>
      <QItem to="/enums">Enums</QItem>

      <QSpace />
      <QSeparator />
      <QItem class="row q-mt-auto">
        <LogoutButton />
      </QItem>
      <!-- <QItemLabel header> {{ $gettext('Sections') }} </QItemLabel> -->
    </QList>
  </QDrawer>
</template>

<script setup lang="ts">
import { QItem } from 'quasar';
import { useGlobalConfig } from 'src/stores/globalConfig';
import LogoutButton from './LogoutButton.vue';

const config = useGlobalConfig();
</script>
