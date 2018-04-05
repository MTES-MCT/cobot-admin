<template>
  <div class="container">
    <div class="row layout-padding">
      <!-- <div class="col-12 logo">
        <img src="~assets/quasar-logo-full.svg">
      </div> -->
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
      <!-- <div class="col-6 forgot-password">
        <router-link to="auth/forgot-password">{{ $t("forgotPwd") }}</router-link>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      isWrongCredentials: false,
      credentials: {
        email: 'slegouffe@gmail.com',
        password: 'apasaz75',
      },
    };
  },
  methods: {
    doLogin() {
      this.loading = true;
      this.$auth.login({
        data: this.credentials,
        redirect: { name: 'dashboard' },
        rememberMe: true,
        fetchUser: true,
      }).then(() => {
        this.loading = false;
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
