<template>
  <div class="container">
    <div v-if="!setNewPassword || notAllowed" class="row layout-padding">
      <div class="col-12">
        <q-input v-model="credentials.email" :stack-label="$t('auth.login')" color="pink" />
      </div>
      <div class="col-12" style="margin-top:20px;">
        <q-field :error="isWrongCredentials" :error-label="$t('auth.error')">
          <q-input
            @keyup="onKeyUp"
            v-model="credentials.password"
            :stack-label="$t('auth.password')"
            color="pink"
            type="password" />
        </q-field>
      </div>
      <div class="col-6" style="margin-top:20px;">
        <q-btn :loading="loading" @click="doLogin" full-width default color="pink">
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
                   color="pink"
                   type="password" />
        </div>
        <div class="col-12" style="margin-top:20px;">
          <q-field :error="isWrongCredentials" :error-label="$t('auth.error')">
            <q-input
              @keyup="onKeyUp"
              v-model="credentials.confirmPassword"
              :stack-label="$t('auth.confirmPassword')"
              color="pink"
              type="password" />
          </q-field>
        </div>
        <div class="col-6" style="margin-top:20px;">
          <q-btn :disable="isDisabledPasswordBtn()"
                 :loading="loading" @click="createPassword" full-width default color="pink">
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
      async update(data) {
        try {
          const apiSIGToken = await this.$axiosSIG.post('/auth/local', {
            identifier: this.credentials.email,
            password: this.credentials.password,
          });
          console.log(apiSIGToken);
          this.$localStorage.set('sig_auth_token', apiSIGToken.data.jwt);
        } catch (e) {
          console.log('Bad SIG account');
        }
        const user = data.Me;
        this.$store.commit('project/SET_PROJECTS', user.projects);
        this.$localStorage.set('projects', JSON.stringify(user.projects));
        const lastProjectOpened = JSON.parse(this.$localStorage.get('project'));
        const role = (lastProjectOpened && lastProjectOpened.role) ?
          lastProjectOpened.role : user.projects[0].role;

        this.$store.commit('users/SET_USER', {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        });

        this.$store.commit('users/SET_OPEN_WELCOME', true);
        if (lastProjectOpened) {
          this.$store.commit('project/SET_PROJECT', lastProjectOpened);
          this.$router.push({ name: 'dashboard.contribute.object', params: { id: lastProjectOpened.id } });
        } else {
          this.$store.commit('project/SET_PROJECT', user.projects[0]);
          this.$localStorage.set('project', JSON.stringify(user.projects[0]));
          this.$router.push({ name: 'dashboard.contribute.object', params: { id: user.projects[0].id } });
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
