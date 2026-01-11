<template>
  <QTable
    :title="_('Users')"
    :rows="users.users"
    :columns="columns"
    class="full-height full-width"
    :loading="users.loading"
    selection="multiple"
    v-model:selected="selected"
    :pagination="{ rowsPerPage: 0 }"
  >
    <template v-slot:body-cell-active="props">
      <QTd :props="props" class="text-center">
        <QToggle
          v-model="props.row.active"
          @update:model-value="(val) => setUserActiveStatus(props.row.id, val)"
        />
      </QTd>
    </template>
    <template v-slot:top>
      <div class="column q-gutter-md">
        <label class="q-table__title">{{ _('Users') }}</label>
        <div class="row q-gutter-md">
          <QBtn :label="_('Create new user')" @click="createUser = true" />
          <QBtn
            :label="_('Update user')"
            :disable="selected.length !== 1"
            @click="updateUser = selected[0]! as UserDTO"
          />
          <QBtn
            :label="$ngettext('Delete user', 'Delete users', selected.length)"
            :disable="!selected.length"
            @click="confirmUserDeletion = true"
          />
        </div>
      </div>
    </template>
  </QTable>
  <UserForm
    :open="!!createUser || !!updateUser"
    :user="updateUser ?? null"
    @close="onClose"
    @confirm="onClose"
  />
  <QDialog :model-value="confirmUserDeletion">
    <QCard>
      <QCardSection class="row items-center">
        {{
          $ngettext(
            'Are you sure you want to delete %{count} user',
            'Are you sure you want to delete %{count} users',
            selected.length,
            {
              count: selected.length,
            },
          )
        }}
      </QCardSection>
      <QCardActions align="right">
        <QBtn
          flat
          color="negative"
          :label="$gettext('Cancel')"
          @click="confirmUserDeletion = false"
        />
        <QBtn color="secondary" :label="$gettext('Confirm')" @click="deleteUsers" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { QTableColumn } from 'quasar';
import type { UserDTO } from 'src/api/api';
import { useUsers } from 'src/stores/users';
import { ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import UserForm from './UserForm.vue';
import { safeRequest } from 'src/utils/safeRequest';
import { useApi } from 'src/composables/useApi';
import { useRoles } from 'src/stores/roles';

const { $gettext: _ } = useGettext();
const users = useUsers();
const selected = ref([]);
const createUser = ref(false);
const updateUser = ref<UserDTO | null>(null);
const api = useApi();
const confirmUserDeletion = ref(false);
const roles = useRoles();

const columns: QTableColumn<UserDTO>[] = [
  {
    name: 'active',
    label: _('Is active'),
    field: 'active',
  },
  {
    name: 'email',
    label: _('Email'),
    field: 'email',
  },
  {
    name: 'role',
    label: _('Rol'),
    field: 'role',
    format: (roleId) => roles.roles?.find(({ id }) => id === roleId)?.name ?? roleId,
  },
  {
    name: 'lastSignInAt',
    label: _('Last sign in at'),
    field: 'lastSignInAt',
    format: (date) => (!date ? '' : moment(date).fromNow()),
  },
  {
    name: 'delete',
    label: '',
    field: 'id',
    format: () => '',
  },
];

const setUserActiveStatus = async (id: string, value: boolean) => {
  await users.setUserActiveStatus(id, value);
};

const onClose = () => {
  createUser.value = false;
  updateUser.value = null;
};

const deleteUsers = async () => {
  confirmUserDeletion.value = false;
  if (!selected.value.length) return;

  const { data, error } = await safeRequest(() =>
    api.auth.authControllerDeleteUser({
      users: selected.value.map(({ id }) => id),
    }),
  );

  if (!error && !!data?.length) {
    selected.value = [];
    users.delete(data);
  }
};
</script>
