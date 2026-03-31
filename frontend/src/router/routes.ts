import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Register',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('pages/auth/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/appointments',
      },
      {
        path: 'appointments',
        name: 'appointments.list',
        component: () => import('pages/appointments/AppointmentListPage.vue'),
      },
      {
        path: 'appointments/new',
        name: 'appointments.create',
        component: () => import('pages/appointments/AppointmentCreatePage.vue'),
      },
      {
        path: 'appointments/:id',
        name: 'appointments.details',
        component: () => import('pages/appointments/AppointmentDetailsPage.vue'),
        props: true,
      },
      {
        path: 'appointments/:id/edit',
        name: 'appointments.edit',
        component: () => import('pages/appointments/AppointmentEditPage.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
