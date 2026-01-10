import type { HttpResponse } from 'src/api/api';

export const safeRequest = async <T, E>(caller: () => Promise<HttpResponse<T, E>>) => {
  try {
    const data = await caller();
    const response = await data.json();

    return { data: response as T };
  } catch (error) {
    return { error: error as E };
  }
};
