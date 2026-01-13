<template>
  <QDialog :model-value="$props.open" @hide="emit('close')" persistent class="row no-wrap"
    ><QCard class="q-pa-md">
      <QCardSection>
        <label class="text-h6">{{
          $props.user ? $gettext('Update user') : $gettext('Create user')
        }}</label>
      </QCardSection>
      <QCardSection class="column q-gutter-sm">
        <QInput :label="$gettext('Email')" v-model="userInfo.email" />
        <QSelect
          :options="roles.roles"
          :label="$gettext('Role')"
          v-model="userInfo.role"
          option-value="id"
          option-label="name"
          emit-value
        />
        <PasswordInput
          v-if="!$props.user"
          :label="$gettext('Password')"
          v-model="userInfo.password"
        />
        <PasswordInput
          v-if="!$props.user"
          :label="$gettext('Confirm password')"
          v-model="confirmPassword"
        />
      </QCardSection>
      <QCardActions align="right">
        <QBtn flat color="negative" :label="$gettext('Cancel')" @click="emit('close')" />
        <QBtn
          :disable="!isValid(userInfo)"
          color="secondary"
          :label="$gettext('Confirm')"
          @click="confirm"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import type { UserDTO } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { useRoles } from 'src/stores/roles';
import { useUsers } from 'src/stores/users';
import { safeRequest } from 'src/utils/safeRequest';
import { reactive, ref, watch } from 'vue';
import PasswordInput from './PasswordInput.vue';

type UserInfo = {
  email: string;
  role: string;
  password: string;
};

const userInfo = reactive<Partial<UserInfo>>({});
const confirmPassword = ref('');
const roles = useRoles();
const api = useApi();
const users = useUsers();

const emit = defineEmits<{
  close: [];
  confirm: [UserDTO];
}>();

const props = defineProps<{
  open: boolean;
  user: null | UserDTO;
}>();

watch(props, () => {
  if (props.user) {
    userInfo.email = props.user.email;
    userInfo.role = props.user.role;
  }
});

const isValid = (info: Partial<UserInfo>): info is UserInfo =>
  !!info.email &&
  !!info.role &&
  (!!props.user || (!!info.password && (!!props.user || confirmPassword.value == info.password)));

const reset = () => {
  userInfo.email = '';
  userInfo.password = '';
  userInfo.role = '';
};

const confirm = async () => {
  if (!isValid(userInfo)) return;

  if (!props.user) {
    const { data, error } = await safeRequest(() =>
      api.auth.authControllerCreateUser(
        {
          email: userInfo.email,
          password: userInfo.password,
          role: userInfo.role,
        },
        {
          secure: true,
        },
      ),
    );

    if (data && !error) {
      users.push(data);
      emit('confirm', data);
      reset();
    }
  } else {
    const { data, error } = await safeRequest(() =>
      api.auth.authControllerUpdateUser(props.user!.id, {
        email: userInfo.email,
        role: userInfo.role,
      }),
    );

    if (data && !error) {
      users.update(data);
      emit('confirm', data);
      reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: calc(100% * 10 / 12);
}

@media (min-width: $breakpoint-md-min) {
  .q-card {
    width: calc(100% * 6 / 12);
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-card {
    width: calc(100% * 4 / 12);
  }
}
</style>
