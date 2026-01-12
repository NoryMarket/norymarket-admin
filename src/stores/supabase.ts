import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

import { defineStore } from 'pinia';
import { useApi } from 'src/composables/useApi';
import { ref, watch } from 'vue';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const useSupabase = defineStore('supabase', () => {
  const supabase = createClient(url, anonKey);
  const api = useApi();

  const session = ref<Session | null>(null);
  const user = ref<User | null>(null);
  const ready = ref(false);

  const init = async () => {
    const { data } = await supabase.auth.getSession();
    session.value = data.session ?? null;
    user.value = data.session?.user ?? null;

    supabase.auth.onAuthStateChange((_e, newSession) => {
      user.value = newSession?.user ?? null;
      session.value = newSession;
    });

    ready.value = true;
  };

  watch(session, (newValue) => {
    api.setSecurityData(newValue?.access_token ?? null);
  });

  const signIn = async (email: string, password: string) => {
    if (user.value) return { user };

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data) {
      user.value = data.user;
      session.value = data.session;
    }

    return { error, user: user.value };
  };

  const signOut = async () => {
    if (!user.value) return;

    const { error } = await supabase.auth.signOut();

    if (!error) {
      user.value = null;
      session.value = null;

      return true;
    }
  };

  return { user, ready, session, init, signIn, signOut };
});
