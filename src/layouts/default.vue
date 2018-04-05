<template>
  <div>
    <q-toolbar class="header"
               slot="header"
               :glossy="$q.theme === 'mat'"
               :inverted="$q.theme === 'ios'"
              color="primary">
      <q-toolbar-title class="title">
        <router-link to="/">{{ $t('global.appTitle') }}</router-link>
      </q-toolbar-title>
      <!-- <rs-header-user :firstname="firstname" :lastname="lastname"></rs-header-user> -->
    </q-toolbar>

    <div class="column items-center no-wrap">
      <router-view />
    </div>
</div>
</template>

<script>
import { openURL } from 'quasar';

export default {
  name: 'LayoutDefault',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
    openURL,
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .bg-light-blue
    background-color: $bg-light-blue;
  .header
    margin-bottom: 40px;
    .title
      font-family: 'Shartoll';
      font-weight: 900;
      font-size: 20px;
      color: $neutral;
    a
      text-decoration: none;
      color: $neutral;
      &:hover
        color: $neutral;
  .breadcrumb-container
    width: 80vw;
    max-width: 1200px;
    font-size: 12px;
</style>
