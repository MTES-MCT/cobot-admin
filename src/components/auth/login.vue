<template>
  <div class="container">
    <div v-if="!setNewPassword || notAllowed" class="row layout-padding">
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
    <div v-if="setNewPassword && !notAllowed" class="row layout-padding">
      <div class="col-12">
          <h3>Bienvenue !</h3>
          <p>Pour accéder à votre espace, merci de créer votre mot de passe</p>
        </div>
        <div class="col-12">
          <q-input v-model="credentials.password"
                   :stack-label="$t('auth.password')"
                   color="primary"
                   type="password" />
        </div>
        <div class="col-12" style="margin-top:20px;">
          <q-field :error="isWrongCredentials" :error-label="$t('auth.error')">
            <q-input
              @keyup="onKeyUp"
              v-model="credentials.confirmPassword"
              :stack-label="$t('auth.confirmPassword')"
              color="primary"
              type="password" />
          </q-field>
        </div>
        <div class="col-6" style="margin-top:20px;">
          <q-btn :disable="isDisabledPasswordBtn()"
                 :loading="loading" @click="createPassword" full-width default color="primary">
            {{ $t("auth.btnCreatePassword") }}
            <span slot="loading">
              <div> {{ $t("global.connecting") }}</div>
            </span>
          </q-btn>
        </div>
    </div>
  </div>
</template>

<script>
// USER_PASSWORD_UPDATE
import { ME_QUERY, AUTOLOGIN, USER_PASSWORD_UPDATE } from '../../constants/graphql';

export default {
  name: 'login',
  data() {
    return {
      email: this.$route.params.email,
      setNewPassword: false,
      notAllowed: false,
      loading: false,
      skipAutoLoginQuery: true,
      skipQuery: true,
      isWrongCredentials: false,
      credentials: {
        id: '',
        email: '',
        password: '',
      },
    };
  },
  mounted() {
    if (this.email) {
      this.autologin();
    }
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
    autologin() {
      this.$apollo.queries.Autologin.skip = false;
      this.$apollo.queries.Autologin.refetch();
    },
    isDisabledPasswordBtn() {
      return !this.credentials.password;
    },
    async createPassword() {
      if (this.credentials.password === this.credentials.confirmPassword) {
        try {
          await this.$apollo.mutate({
            mutation: USER_PASSWORD_UPDATE,
            variables: {
              id: this.credentials.id,
              password: this.credentials.password,
            },
          });
          this.doLogin();
        } catch (error) {
          this.$q.notify({ message: this.$t('global.error'), type: 'danger' });
        }
      }
    },
  },
  apollo: {
    Me: {
      query: ME_QUERY,
      update(data) {
        this.$localStorage.set('projects', JSON.stringify(data.Me.projects));
        const lastProjectOpened = JSON.parse(this.$localStorage.get('project'));
        if (lastProjectOpened) {
          this.$router.push({ name: 'dashboard.contribute.object', params: { id: lastProjectOpened.id } });
        } else {
          this.$localStorage.set('project', JSON.stringify(data.Me.projects[0]));
          this.$router.push({ name: 'dashboard.contribute.object', params: { id: data.Me.projects[0].id } });
        }
      },
      skip() {
        return this.skipQuery;
      },
    },
    Autologin: {
      query: AUTOLOGIN,
      variables() {
        return {
          email: this.email,
        };
      },
      update(data) {
        console.log(data);
        if (data && data.AutoLogin) {
          if (!data.AutoLogin.lastConnection) {
            this.credentials = {
              id: data.AutoLogin.id,
              email: data.AutoLogin.email,
            };
            this.setNewPassword = true;
          } else {
            this.credentials.email = this.email;
          }
        } else {
          this.notAllowed = true;
        }
      },
      skip() {
        return this.skipAutoLoginQuery;
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
