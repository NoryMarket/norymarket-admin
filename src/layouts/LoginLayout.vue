<template>
  <QLayout>
    <QPageContainer>
      <QPage class="row">
        <QCard bordered class="column absolute-center q-pa-md col-10 col-md-6 col-lg-4">
          <QCardSection class="column items-center">
            <label class="text-h5 text-weight-bold text-primary">
              {{ $gettext('Nory Art') }}
            </label>
            <label class="text-subtitle1">{{
              $gettext('Sign in below to access your account')
            }}</label></QCardSection
          ><QCardSection>
            <QInput v-model="email" :label="$gettext('Email')" />
            <PasswordInput v-model="password" :label="$gettext('Password')" />
          </QCardSection>
          <QCardSection class="text-center fullwidth row">
            <QBtn
              :label="$gettext('Sign in')"
              class="col-12"
              color="black"
              :disable="!email || !password"
              @click="signIn"
            />
          </QCardSection>
        </QCard> </QPage
    ></QPageContainer>
  </QLayout>
</template>

<script setup lang="ts">
import PasswordInput from 'src/components/PasswordInput.vue';
import { useSupabase } from 'src/stores/supabase';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGettext } from 'vue3-gettext';

const { $gettext } = useGettext();
const router = useRouter();

const errorMessages: Record<string, string> = {
  invalid_credentials: $gettext('Invalid credentials'),
};

const supabase = useSupabase();

const email = ref('');
const password = ref('');
const signinIn = ref(false);

const errorMessage = ref('');

const signIn = async () => {
  signinIn.value = true;
  errorMessage.value = '';
  const { user, error } = await supabase.signIn(email.value, password.value);

  if (error) {
    errorMessage.value =
      typeof error.code === 'string' && errorMessages[error.code]
        ? (errorMessages[error.code] as string)
        : $gettext('Authentication failed');
  }

  signinIn.value = false;

  if (user) {
    void router.push({
      path: (router.currentRoute.value.query.from as string) ?? '/',
    });
  }
};
</script>

<style lang="scss" scoped>
.q-page {
  background-color: var(--nory-bg);
}

.text-h5 {
  color: var(--nory-ink-1);
}
</style>
