<template>
  <QDrawer v-model="config.isLeftSidebarOpen" show-if-above bordered>
    <QList class="full-height column">
      <IfPermission permission="dashboard"><QItem to="/index">Index</QItem></IfPermission>
      <IfPermission permission="users">
        <QItem to="/users">Users</QItem>
      </IfPermission>
      <IfPermission permission="enums"><QItem to="/enums">Enums</QItem></IfPermission>

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
import IfPermission from './IfPermission.vue';

const config = useGlobalConfig();
</script>
