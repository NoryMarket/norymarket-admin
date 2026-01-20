import { defineStore } from 'pinia';
import type { QuantityUnitDto, CreateQuantityUnitDto, UpdateQuantityUnitDto } from 'src/api/api';
import { useApi } from 'src/composables/useApi';
import { safeRequest } from 'src/utils/safeRequest';
import { useAppConfig } from './appConfig';
import { useCachedResource } from 'src/composables/useCachedResource';

export const useQuantityUnits = defineStore('quantityUnits', () => {
  const api = useApi();
  const appConfig = useAppConfig();

  const { data: quantityUnits, load: loadQuantityUnits } = useCachedResource<QuantityUnitDto[]>(
    [],
    async () => {
      const { data, error } = await safeRequest(() =>
        api.configuration.configurationControllerGetQuantityUnits(),
      );

      return !data || error ? undefined : data;
    },
  );

  const getQuantityUnitById = (id: string) =>
    quantityUnits.value.find((quantityUnit) => quantityUnit.id === id);

  const load = async (force = false) => {
    await appConfig.load();
    await loadQuantityUnits(force);
  };

  const createQuantityUnit = async (quantityUnit: CreateQuantityUnitDto) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerCreateQuantityUnit(quantityUnit),
    );

    if (!data || error) return;

    quantityUnits.value.unshift(data);

    return data;
  };

  const updateQuantityUnit = async (id: string, quantityUnit: UpdateQuantityUnitDto) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerUpdateQuantityUnit(id, quantityUnit),
    );

    if (!data || error) return;

    const current = getQuantityUnitById(id);

    if (!current) return;

    Object.assign(current, data);
    return data;
  };
  const deleteQuantityUnits = async (ids: string[]) => {
    const { data, error } = await safeRequest(() =>
      api.configuration.configurationControllerDeleteQuantityUnits({ ids }),
    );

    if (error) return;

    quantityUnits.value = quantityUnits.value.filter(
      (quantityUnit) => !ids.includes(quantityUnit.id),
    );
    return data;
  };

  return {
    quantityUnits,
    load,
    getQuantityUnitById,
    createQuantityUnit,
    updateQuantityUnit,
    deleteQuantityUnits,
  };
});
