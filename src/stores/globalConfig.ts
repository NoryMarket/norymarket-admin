import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalConfig = defineStore('globalConfig', () => {
  const isLeftSidebarOpen = ref(false);

  return {
    isLeftSidebarOpen,
    toggleIsLeftSidebarOpen: () => {
      isLeftSidebarOpen.value = !isLeftSidebarOpen.value;
    },
  };
});
