<template>
<q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="cc-dark-light">
        <q-toolbar-title>
          <div class="row">
            <div class="col-3">
              <div class="logo">
                <div class="row">
                  <div class="col-10">
                    <span>COBOT</span>
                    <p><small>{{ projectName }}</small></p>
                  </div>
                  <div class="col-2" style="padding-top: 10px;">
                    <q-btn flat
                           dense
                           round
                           @click="leftDrawerOpen = !leftDrawerOpen"
                           aria-label="Menu" >
                      <q-icon name="menu" />
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-9" style="padding-left: 50px;">
              <q-btn @click="goTo('dashboard', $route.params.id)"
                     flat icon="dashboard" label="Dashboard" />
              <q-btn @click="goTo('dashboard.contributors', $route.params.id)"
                    flat icon="group" label="Contributeurs" />
              <q-btn @click="goTo('dashboard.dataset', $route.params.id)"
                     flat icon="ballot" label="Jeu de donnée" />
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
      <cc-subheader-label v-if="activeLeftPanel === 'CcLeftPanelLabel'"/>
      <cc-subheader-user v-if="activeLeftPanel === 'CcLeftPanelUser'"/>
      <div class="row main">
        <div class="col-3">
          <cc-left-panel-user v-if="activeLeftPanel === 'CcLeftPanelUser'" />
          <cc-left-panel-label v-if="activeLeftPanel === 'CcLeftPanelLabel'" />
        </div>
        <div class="col-9 col-right">
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
import CcLeftPanelLabel from 'components/cc-left-panel-label';
import CcSubheaderLabel from 'components/cc-subheader-label';
import CcLeftPanelUser from 'components/cc-left-panel-user';
import CcSubheaderUser from 'components/cc-subheader-user';

export default {
  name: 'LayoutDefault',
  components: {
    CcHeaderUser,
    CcMenu,
    CcLeftPanelLabel,
    CcSubheaderLabel,
    CcLeftPanelUser,
    CcSubheaderUser,
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      projectName: null,
      activeLeftPanel: null,
    };
  },
  watch: {
    $route(to) {
      this.setPanel(to.name);
    },
  },
  mounted() {
    console.log(this.$route);
    this.setPanel(this.$route.name);
    this.$root.$on('projectChanged', () => {
      this.getProjectName();
    });
    this.getProjectName();
  },
  methods: {
    getProjectName() {
      const project = JSON.parse(this.$localStorage.get('project'));
      if (project) {
        this.projectName = project.name;
      }
    },
    setPanel(name) {
      switch (name) {
        case 'dashboard':
          this.activeLeftPanel = 'CcLeftPanelDashboard';
          break;
        case 'dashboard.dataset':
          this.activeLeftPanel = 'CcLeftPanelDataset';
          break;
        case 'dashboard.contributors':
          this.activeLeftPanel = 'CcLeftPanelUser';
          break;
        case 'dashboard.contribute.object':
          this.activeLeftPanel = 'CcLeftPanelLabel';
          break;
        default:
          this.activeLeftPanel = null;
      }
    },
    goTo(to, id) {
      this.$router.push({ name: to, params: { id } });
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .q-toolbar
    height 70px
  .col-right
    background-color #FFF
  .main
    padding-top 67px
  .logo
    position absolute
    top 0
    left 0
    width 25%
    height 100%
    background-color $cc-dark
    box-shadow inset 0px 0px 5px 0px rgba(0,0,0,0.75)
    padding 10px 0 0 15px
  .breadcrumb-container
    width 80vw
    max-width 1200px
    font-size 12px
</style>
