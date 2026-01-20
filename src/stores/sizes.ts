import { defineStore } from 'pinia';
import type { CreateSizeDTO, SizeDTO, UpdateSizeDTO } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { useAppConfig } from './appConfig';
import { useCachedResource } from 'src/composables/useCachedResource';

export const useSizes = defineStore('sizes', () => {
  const api = useApi();
  const appConfig = useAppConfig();

  const { data: sizes, load: loadSizes } = useCachedResource<SizeDTO[]>([], async () => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerGetSizes(),
    );

    return !data || error ? undefined : data;
  });

  const getSizeById = (id: string) => sizes.value.find((size) => size.id === id);

  const load = async (force = false) => {
    await appConfig.load();
    await loadSizes(force);
  };

  const createSize = async (size: CreateSizeDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerCreateSize(size),
    );

    if (!data || error) return;

    sizes.value.unshift(data);

    return data;
  };

  const updateSize = async (id: string, size: UpdateSizeDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerUpdateSize(id, size),
    );

    if (!data || error) return;

    const current = getSizeById(id);

    if (!current) return;

    Object.assign(current, data);
    return data;
  };
  const deleteSizes = async (ids: string[]) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerDeleteSizes({ ids }),
    );

    if (error) return;

    sizes.value = sizes.value.filter((size) => !ids.includes(size.id));
    return data;
  };

  return {
    sizes,
    load,
    getSizeById,
    createSize,
    updateSize,
    deleteSizes,
  };
});
