
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    redirect: { name: 'dashboard' },
    meta: {
      auth: {
        roles: [80, 100],
        forbiddenRedirect: '/403',
      },
    },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('pages/dashboard'),
      },
      {
        name: 'crud.list',
        path: 'crud',
        component: () => import('pages/crud/index'),
        children: [
          {
            path: '',
            name: 'crud.list',
            component: () => import('pages/crud/list'),
          },
          {
            path: ':id',
            name: 'crud.edit',
            component: () => import('pages/crud/edit'),
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    name: 'auth',
    meta: { auth: false },
    component: () => import('layouts/authLayout'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('components/auth/login'),
      },
    ],
  },
  {
    path: '/403',
    name: 'error-403',
    component: () => import('pages/403'),
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404'),
  },
];
