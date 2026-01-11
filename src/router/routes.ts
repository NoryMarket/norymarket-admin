import type { Permissions } from 'src/stores/roles';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'index', component: () => import('pages/IndexPage.vue') },
      {
        path: 'users',
        meta: { permission: 'users' as Permissions },
        component: () => import('pages/UsersPage.vue'),
      },
      {
        path: 'enums',
        meta: { permission: 'enums' as Permissions },
        component: () => import('pages/EnumsPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    meta: { public: true },
    component: () => import('layouts/LoginLayout.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
