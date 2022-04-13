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
          color: 'pink',
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'grey',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.$localStorage.remove('projects');
        this.$localStorage.remove('project');
        this.$localStorage.remove('sig_auth_token');
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
  .CsHeader
    background: $cc-dark;
    position: absolute;
    padding: 17px;
    right: 0px;
    box-shadow inset 0px 0px 5px 0px rgba(0,0,0,0.75)
    a
      color $neutral;
      font-size 70%;
      text-decoration underline;
      &:hover
        color $neutral;
</style>
