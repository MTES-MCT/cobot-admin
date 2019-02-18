<template>
  <div class="container">
    <div class="row layout-padding">
      <div class="col-12">
        <q-input v-model="credentials.email" :stack-label="$t('auth.login')" color="primary" />
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-field :error="isWrongCredentials" :error-label="$t('auth.error')">
          <q-input
            @keyup="onKeyUp"
            v-model="credentials.password"
            :stack-label="$t('auth.password')"
            color="primary"
            type="password" />
        </q-field>
      </div>
      <div class="col-6" style="margin-top:20px;">
        <q-btn :loading="loading" @click="doLogin" full-width default color="primary">
          {{ $t("auth.btnLogin") }}
          <span slot="loading">
            <div> {{ $t("global.connecting") }}</div>
          </span>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ME_QUERY } from '../../constants/graphql';

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      skipQuery: true,
      isWrongCredentials: false,
      credentials: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    doLogin() {
      this.loading = true;
      this.$auth.login({
        data: this.credentials,
        redirect: null,
        rememberMe: true,
        fetchUser: true,
      }).then(() => {
        this.loading = false;
        this.$apollo.queries.Me.skip = false;
        this.$apollo.queries.Me.refetch();
      }, () => {
        this.isWrongCredentials = true;
        this.loading = false;
      });
    },
    onKeyUp(event) {
      if (event.key === 'Enter') {
        this.doLogin(null, null);
      }
    },
  },
  apollo: {
    Me: {
      query: ME_QUERY,
      update(data) {
        this.$router.push(`/dashboard/${data.Me.projects[0].name.replace(/\s/g, '').toLowerCase()}`);
        this.$localStorage.set('projects', JSON.stringify(data.Me.projects));
        this.$localStorage.set('projectName', data.Me.projects[0].name);
      },
      skip() {
        return this.skipQuery;
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .container
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .logo
      text-align: center;
      padding-bottom: 30px;
    .forgot-password
      padding-top:10px;
</style>
