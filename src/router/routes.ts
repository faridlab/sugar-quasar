import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Protected routes (require authentication)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('pages/users/UsersListPage.vue'),
        meta: { permission: 'users.view' },
      },
      {
        path: 'users/create',
        name: 'users.create',
        component: () => import('pages/users/UserCreatePage.vue'),
        meta: { permission: 'users.create' },
      },
      {
        path: 'users/:id',
        name: 'users.show',
        component: () => import('pages/users/UserShowPage.vue'),
        meta: { permission: 'users.view' },
      },
      {
        path: 'users/:id/edit',
        name: 'users.edit',
        component: () => import('pages/users/UserEditPage.vue'),
        meta: { permission: 'users.edit' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue'),
      },
    ],
  },

  // Auth routes (guest only)
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/auth/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/auth/RegisterPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('pages/auth/ForgotPasswordPage.vue'),
    meta: { guest: true },
  },

  // Error pages
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('pages/errors/ForbiddenPage.vue'),
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
