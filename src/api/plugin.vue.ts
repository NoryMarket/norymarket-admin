import type { App, InjectionKey } from 'vue';
import type { Api } from './api';

export const ApiKey: InjectionKey<Api<string>> = Symbol('Api');

export function createApiPlugin(api: Api<string>) {
  return {
    install(app: App) {
      app.provide(ApiKey, api);
    },
  };
}
