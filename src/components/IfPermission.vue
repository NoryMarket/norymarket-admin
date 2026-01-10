<template>
  <slot v-if="allowed" />
</template>

<script setup lang="ts">
import type { Permissions } from 'src/stores/roles';
import { useRoles } from 'src/stores/roles';
import { useSupabase } from 'src/stores/supabase';
import { computed } from 'vue';

const { permission } = defineProps<{
  permission: Permissions[] | Permissions;
}>();
const roles = useRoles();
const supabase = useSupabase();

const allowed = computed(() => {
  const currentRole = roles.roles?.find(({ id }) => supabase.user?.role === id);

  if (!currentRole) return false;

  return currentRole.permissions.some((rolePermission) =>
    Array.isArray(permission)
      ? permission.some((p) => p === rolePermission)
      : rolePermission === permission,
  );
});
</script>
