<template>
  <QToolbar>
    <QBtn flat dense round icon="menu" aria-label="Menu" @click="config.toggleIsLeftSidebarOpen" />

    <QToolbarTitle>
      {{ $gettext('Admin') }}
    </QToolbarTitle>
    <label>{{ $gettext('Welcome %{name}', { name: supabase.user?.email ?? '' }) }}</label>
  </QToolbar>
</template>

<script setup lang="ts">
import { useGlobalConfig } from 'src/stores/globalConfig';
import { useSupabase } from 'src/stores/supabase';

const supabase = useSupabase();
const config = useGlobalConfig();
</script>
