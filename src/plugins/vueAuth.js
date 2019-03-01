import VueAuth from '@websanova/vue-auth';
import bearerAuth from '@websanova/vue-auth/drivers/auth/bearer.js';
import httpAuth from '@websanova/vue-auth/drivers/http/axios.1.x.js';
import routerAuth from '@websanova/vue-auth/drivers/router/vue-router.2.x.js';
import _ from 'lodash';

export default ({ router, app, Vue }) => {
  router.beforeEach((to, from, next) => {
    app.projectId = to.params.id;
    next();
  });
  Vue.use(VueAuth, {
    auth: bearerAuth,
    http: httpAuth,
    router: routerAuth,
    rolesVar: 'role',
    loginData: {
      url: '/auth/login',
      method: 'POST',
    },
    fetchData: {
      url: '/auth/user',
      method: 'GET',
      enabled: true,
    },
    parseUserData: (data) => {
      const currentProject = _.filter(data.projects, (project => project.id === app.projectId));
      data.role = currentProject[0].role;
      return data;
    },
    tokenExpired: false,
    authRedirect: {
      path: '/auth/login',
    },
    refreshData: {
      enabled: false,
    },
  });
};

