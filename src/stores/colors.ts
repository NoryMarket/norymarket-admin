import { defineStore } from 'pinia';
import type { CreateColorDTO, ColorDTO, UpdateColorDTO } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { useAppConfig } from './appConfig';
import { useCachedResource } from 'src/composables/useCachedResource';

export const useColors = defineStore('colors', () => {
  const api = useApi();
  const appConfig = useAppConfig();

  const { data: colors, load: loadColors } = useCachedResource<ColorDTO[]>([], async () => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerGetColors(),
    );

    return !data || error ? undefined : data;
  });

  const getColorById = (id: string) => colors.value.find((color) => color.id === id);

  const load = async (force = false) => {
    await appConfig.load();
    await loadColors(force);
  };

  const createColor = async (color: CreateColorDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerCreateColor(color),
    );

    if (!data || error) return;

    colors.value.unshift(data);

    return data;
  };

  const updateColor = async (id: string, color: UpdateColorDTO) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerUpdateColor(id, color),
    );

    if (!data || error) return;

    const current = getColorById(id);

    if (!current) return;

    Object.assign(current, data);
    return data;
  };
  const deleteColors = async (ids: string[]) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerDeleteColors({ ids }),
    );

    if (error) return;

    colors.value = colors.value.filter((color) => !ids.includes(color.id));
    return data;
  };

  return {
    colors,
    load,
    getColorById,
    createColor,
    updateColor,
    deleteColors,
  };
});
