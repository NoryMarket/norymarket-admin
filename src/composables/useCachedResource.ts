import { ref } from 'vue';

export const useCachedResource = <Data>(
  initial: Data,
  resolver: () => Promise<Data | void | undefined>,
) => {
  const ready = ref(false);
  const data = ref<Data>(initial);
  const loading = ref<false | Promise<Data | void | undefined>>(false);

  const load = async (force = false) => {
    if (!force && ready.value) return;

    loading.value = resolver();
    const result = await loading.value;
    loading.value = false;

    if (!result) return;

    data.value = result;
    ready.value = true;
  };

  return { data, loading, load };
};
