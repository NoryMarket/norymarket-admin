import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useSupabase } from 'src/stores/supabase';
import { useRoles } from 'src/stores/roles';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from) => {
    const supabase = useSupabase();
    const roles = useRoles();

    if (!supabase.ready) {
      await supabase.init();
    }

    if (!to.meta.public && !supabase.user) {
      return {
        path: 'login',
        replace: true,
        query: {
          from: to.path,
        },
      };
    }

    if (to.path == '/login' && !!supabase.user) {
      return from.fullPath
        ? {
            path: from.fullPath,
            replace: true,
          }
        : {
            path: '/',
            replace: true,
          };
    }

    if (to.meta.permission) {
      const userRole = supabase.user?.role;
      if (!roles.ready) await roles.loadRoles();
      const rolePermissions = roles.roles?.find(({ id }) => id === userRole)?.permissions ?? [];

      if (!rolePermissions.some((permission) => permission === to.meta.permission)) {
        return from.fullPath
          ? {
              path: from.fullPath,
              replace: true,
            }
          : {
              path: '/',
              replace: true,
            };
      }
    }
  });

  return Router;
});
