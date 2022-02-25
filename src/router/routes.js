
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    redirect: { name: 'dashboard' },
    // meta: {
    //   auth: {
    //     roles: [1, 80, 100],
    //     forbiddenRedirect: '/auth/login',
    //   },
    // },
    children: [
      {
        name: '',
        path: 'dashboard',
        component: () => import('pages/dashboard/index'),
        children: [
          {
            path: ':id?',
            name: 'dashboard',
            component: () => import('pages/dashboard/dashboard'),
          },
          {
            path: 'contributions/:id',
            name: 'dashboard.contributions',
            component: () => import('pages/dashboard/contributions'),
          },
          {
            path: 'contributors/:id',
            name: 'dashboard.contributors',
            component: () => import('pages/dashboard/contributors'),
          },
          {
            path: 'contribute',
            name: 'dashboard.contribute',
            component: () => import('pages/dashboard/contribute'),
            children: [
              {
                path: 'object/:id/:dataset?',
                name: 'dashboard.contribute.object',
                component: () => import('pages/dashboard/contribute/object'),
              },
            ],
          },
          {
            path: 'dataset/:id',
            name: 'dashboard.dataset',
            component: () => import('pages/dashboard/dataset'),
          },
          {
            path: 'labels/:id/:label?',
            name: 'dashboard.labels',
            component: () => import('pages/dashboard/labels'),
          },
        ],
      },
      {
        name: '',
        path: 'project',
        component: () => import('pages/project/index'),
        children: [
          {
            path: '',
            name: 'project.add',
            component: () => import('pages/project/edit'),
          },
          {
            path: ':id',
            name: 'project.edit',
            component: () => import('pages/project/edit'),
          },
          {
            path: ':id',
            name: 'project.general',
            component: () => import('pages/project/general'),
          },
          {
            path: ':id',
            name: 'project.data',
            component: () => import('pages/project/datas'),
          },
        ],
      },
      {
        name: '',
        path: 'gis',
        component: () => import('pages/gis/index'),
        children: [
          {
            path: ':id',
            name: 'gis.segments',
            component: () => import('pages/gis/segments'),
          },
        ],
      },
      {
        name: '',
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
      {
        path: ':email',
        name: 'autologin',
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
