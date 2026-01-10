import { defineStore } from 'pinia';
import type { UserDTO } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { onMounted, ref } from 'vue';

export const useUsers = defineStore('users', () => {
  const api = useApi();

  const users = ref<UserDTO[]>([]);
  const loading = ref(false);

  const loadUsers = async () => {
    loading.value = true;
    try {
      const { data } = await safeRequest(() =>
        api.auth.authControllerGetUsers({
          secure: true,
        }),
      );

      if (data) users.value = data;
    } catch {
      /* empty */
    }

    loading.value = false;
  };

  const setUserActiveStatus = async (userId: string, status: boolean) => {
    const { data, error } = await safeRequest(() =>
      api.auth.authControllerSetUserActiveStatus(userId, status),
    );

    if (error || !data) {
      return;
    }

    const user = users.value.find(({ id }) => id === data.id);

    if (user) user.active = data.active;
  };

  onMounted(() => {
    void loadUsers();
  });

  return { users, loading, loadUsers, setUserActiveStatus };
});
