import { defineStore } from 'pinia';
import type { AuthorizationMetaDTO, RoleDTO } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { onMounted, ref } from 'vue';

export type Permissions = AuthorizationMetaDTO['permissions'][number];

export const useRoles = defineStore('roles', () => {
  const api = useApi();

  const roles = ref<RoleDTO[]>();
  const permissions = ref<Permissions[]>([]);

  const loadRoles = async () => {
    const { data, error } = await safeRequest(() =>
      api.auth.authControllerGetAuthorizationMeta({
        secure: true,
      }),
    );

    if (error || !data) return;

    roles.value = data.roles;
    permissions.value = data.permissions as unknown as Permissions[];
  };

  onMounted(() => {
    void loadRoles();
  });

  return { roles };
});
