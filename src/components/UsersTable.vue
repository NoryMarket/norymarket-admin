<template>
  <QTable
    :title="_('Users')"
    :rows="users.users"
    :columns="columns"
    class="full-height full-width"
    :loading="users.loading"
    selection="multiple"
    v-model:selected="selected"
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
          <QBtn :label="_('Update user')" :disable="selected.length !== 1" />
          <QBtn :label="_('Delete users')" :disable="!selected.length" />
        </div>
      </div>
    </template>
  </QTable>
  <UserForm :open="createUser" :user="null" />
</template>

<script setup lang="ts">
import moment from 'moment';
import type { QTableColumn } from 'quasar';
import type { UserDTO } from 'src/api/api';
import { useUsers } from 'src/stores/users';
import { ref } from 'vue';
import { useGettext } from 'vue3-gettext';
import UserForm from './UserForm.vue';

const { $gettext: _ } = useGettext();
const users = useUsers();
const selected = ref([]);
const createUser = ref(false);

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
  },
  {
    name: 'lastSignInAt',
    label: _('Last sign in at'),
    field: 'lastSignInAt',
    format: (date) => moment(date).fromNow(),
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
</script>
