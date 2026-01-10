<template>
  <QLayout view="lHh Lpr lFf">
    <QHeader elevated><AppToolbar /> </QHeader>
    <LeftSidebar />
    <QPageContainer>
      <router-view />
    </QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import AppToolbar from 'src/components/AppToolbar.vue';
import LeftSidebar from 'src/components/LeftSidebar.vue';
</script>
