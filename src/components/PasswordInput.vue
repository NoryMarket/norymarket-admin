<template>
  <QInput :label="$props.label" v-model="model" :type="isPwd ? 'password' : 'text'">
    <template v-slot:append>
      <QIcon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </template>
  </QInput>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  label?: string;
}>();

const model = defineModel<string | undefined>();

const isPwd = ref(true);
</script>
