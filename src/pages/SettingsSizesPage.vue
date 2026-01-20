<template>
  <q-page class="q-pa-md">
    <page-header
      :title="$gettext('Sizes')"
      :parent-label="$gettext('Settings')"
      :parent-to="{ name: 'settings' }"
      :user-name="user?.email ?? ''"
    />
    <!-- Sizes Section -->
    <q-section class="q-mt-lg">
      <SizesTable />
    </q-section>
  </q-page>
</template>

<script setup lang="ts">
import { useGettext } from 'vue3-gettext';
import PageHeader from 'src/components/PageHeader.vue';
import { useSupabase } from 'src/stores/supabase';
import SizesTable from 'src/components/SizesTable.vue';
const supabase = useSupabase();
//TODO: Remove user information if not necessary
const user = supabase.user;
const { $gettext } = useGettext();
</script>
