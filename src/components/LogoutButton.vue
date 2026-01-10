<template>
  <QBtn
    flat
    icon="logout"
    :label="$gettext('Sign out')"
    class="col-12"
    color="negative"
    @click="signOut"
  />
</template>

<script setup lang="ts">
import { useSupabase } from 'src/stores/supabase';

import { useRouter } from 'vue-router';

const supabase = useSupabase();
const router = useRouter();

const signOut = async () => {
  const success = await supabase.signOut();

  if (success)
    void router.push({
      path: '/login',
    });
};
</script>
