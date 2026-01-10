<template>
  <QDialog :model-value="open"
    ><QCard>
      <QCardSection>
        <label class="text-h6">{{
          user ? $gettext('Update user') : $gettext('Create user')
        }}</label>
      </QCardSection>
      <QCardSection class="column">
        <QInput :label="$gettext('Email')" v-model="userInfo.email" />
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import type { UserDTO } from 'src/api/api';
import { reactive } from 'vue';

const userInfo = reactive<{
  email?: string;
}>({});

const { open, user } = defineProps<{
  open: boolean;
  user: null | UserDTO;
}>();
</script>
