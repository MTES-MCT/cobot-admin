<template>
<q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'" >
        <q-toolbar-title>
          <div class="row">
            <div class="col-3">
              <div class="logo">
                <span style="padding-right: 75%;">COBOT</span>
                <q-btn
                  flat
                  dense
                  round
                  @click="leftDrawerOpen = !leftDrawerOpen"
                  aria-label="Menu" >
                  <q-icon name="menu" />
                </q-btn>
              </div>
            </div>
            <div class="col-9" style="padding-left: 50px;">
              <span>Co-Construisons > Dashboard</span>
            </div>
          </div>
        </q-toolbar-title>
        <cc-header-user :name="$auth.user().email"></cc-header-user>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :overlay="true"
      content-class="bg-grey-2"
    >
      <cc-menu></cc-menu>
    </q-layout-drawer>

    <q-page-container>
      <div class="row">
        <div class="col-3">
          <cc-left-panel />
        </div>
        <div class="col-9">
          <div class="column items-center no-wrap">
            <router-view />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import CcHeaderUser from 'components/cc-header-user';
import CcMenu from 'components/cc-menu';
import CcLeftPanel from 'components/cc-left-panel';

export default {
  name: 'LayoutDefault',
  components: {
    CcHeaderUser,
    CcMenu,
    CcLeftPanel,
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
  .q-toolbar
    min-height 55px
  .logo
    position absolute
    top 0
    left 0
    width 25%
    height 100%
    background-color grey
    box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
    padding 10px 0 0 15px
  .breadcrumb-container
    width 80vw
    max-width 1200px
    font-size 12px
</style>
