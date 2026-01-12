import type { Permissions } from 'src/stores/roles';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      {
        path: 'orders',
        meta: { permission: 'orders' as Permissions },
        component: () => import('pages/OrdersPage.vue'),
      },
      {
        path: 'orders-production',
        meta: { permission: 'production' as Permissions },
        component: () => import('pages/OrdersProductionPage.vue'),
      },
      {
        path: 'bom',
        meta: { permission: 'bom' as Permissions },
        component: () => import('pages/BOMPage.vue'),
      },
      {
        path: 'production-waste',
        meta: { permission: 'waste' as Permissions },
        component: () => import('pages/ProductionWastePage.vue'),
      },
      {
        path: '/supply',
        meta: { permission: 'supply' as Permissions },
        component: () => import('pages/SupplyPage.vue'),
      },
      {
        path: '/supply-type',
        meta: { permission: 'supply-type' as Permissions },
        component: () => import('pages/SupplyTypePage.vue'),
      },
      {
        path: 'waste',
        meta: { permission: 'waste' as Permissions },
        component: () => import('pages/WastePage.vue'),
      },
      {
        path: 'products',
        meta: { permission: 'products' as Permissions },
        component: () => import('pages/ProductsPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
      {
        path: 'settings/general',
        meta: { permission: 'enums' as Permissions },
        component: () => import('pages/SettingsGeneralPage.vue'),
      },
      {
        path: 'settings/currency',
        meta: { permission: 'currency' as Permissions },
        component: () => import('pages/SettingsCurrencyPage.vue'),
      },
      {
        path: 'settings/quantity-unit',
        meta: { permission: 'enums' as Permissions },
        component: () => import('pages/SettingsQuantityUnitPage.vue'),
      },

      {
        path: 'settings/sizes',
        meta: { permission: 'enums' as Permissions },
        component: () => import('pages/SettingsSizesPage.vue'),
      },
      {
        path: 'settings/colors',
        meta: { permission: 'enums' as Permissions },
        component: () => import('pages/SettingsColorsPage.vue'),
      },
      {
        path: 'settings/users',
        meta: { permission: 'users' as Permissions },
        component: () => import('pages/SettingsUsersPage.vue'),
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
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
