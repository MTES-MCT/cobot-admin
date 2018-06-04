<template>
<q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Co-Construisons > Dashboard
        </q-toolbar-title>
        <cc-header-user :name="$auth.user().name"></cc-header-user>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
    >
      <cc-menu></cc-menu>
    </q-layout-drawer>

    <q-page-container>
      <div class="column items-center no-wrap">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import CcHeaderUser from 'components/cc-header-user';
import CcMenu from 'components/cc-menu';

export default {
  name: 'LayoutDefault',
  components: {
    CcHeaderUser,
    CcMenu,
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
    };
  },
  methods: {
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
