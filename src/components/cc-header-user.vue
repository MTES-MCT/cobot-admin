<template>
  <div class="CsHeader">
    <div style="text-align:right">{{ name }}</div>
    <div style="text-align:right">
      <router-link to="">
        <span v-on:click="logout">{{ $t('global.logout') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CcHeaderUser',
  props: ['name'],
  methods: {
    logout() {
      this.$q.dialog({
        title: 'Déconnexion',
        message: 'Etes-vous sûr de vouloir vous déconnecter ?',
        ok: {
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'negative',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.$localStorage.remove('projects');
        this.$auth.logout({
          makeRequest: false,
          redirect: '/auth/login',
        });
      }).catch(() => {
      });
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .CsHeader {
    a {
      color: $neutral;
      font-size: 70%;
      text-decoration: underline;
      &:hover {
        color: $neutral;
      }
    }
  }
</style>
