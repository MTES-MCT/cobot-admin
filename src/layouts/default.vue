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
                  <div v-if="$auth.check([80, 100])"
                       class="col-2" style="padding-top: 10px;">
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
            <div class="col-7" style="padding-left: 20px;">
              <q-btn @click="goTo('dashboard.contribute.object', $route.params.id)"
                     flat icon="public" label="Contribuer" />
              <q-btn v-if="$auth.check([80, 100])" @click="goTo('dashboard', $route.params.id)"
                     flat icon="dashboard" label="Dashboard" />
              <q-btn v-if="$auth.check([80, 100])"
                     @click="goTo('dashboard.contributors', $route.params.id)"
                     flat icon="group" label="Contributeurs" />
              <q-btn v-if="$auth.check([80, 100])"
                     @click="goTo('dashboard.dataset', $route.params.id)"
                     flat icon="ballot" label="Jeu de donnée" />
              <q-btn @click="openInfo()"
                     flat icon="info" label="A propos" />
              <!-- <q-btn @click="openInfo()"
                     class="ia-processing"
                     flat icon="ion-logo-android" label="IA processing" /> -->
                <q-icon
                  v-if="iaOnProgress"
                  class="ia-processing"
                  name="ion-logo-android"
                  style="padding-right: 10px;" />
                <small
                  v-if="iaOnProgress"
                  class="ia-processing">IA processing : {{ processing }}</small>
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

    <q-page-container
      :class="{'project-container': isProjectPage}">
      <router-view />
    </q-page-container>

    <CcInfo></CcInfo>

  </q-layout>
</template>

<script>
import { DATASET_UPLOAD_SUB } from '../constants/graphql';

import CcHeaderUser from 'components/cc-header-user';
import CcMenu from 'components/cc-menu';
import CcInfo from 'components/cc-info';

export default {
  name: 'LayoutDefault',
  components: {
    CcHeaderUser,
    CcMenu,
    CcInfo,
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      projectName: null,
      activeLeftPanel: null,
      processing: null,
      iaOnProgress: false,
    };
  },
  computed: {
    isProjectPage() {
      return this.$route.name === 'project.edit';
    },
  },
  mounted() {
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
    goTo(to, id) {
      this.$router.push({ name: to, params: { id } });
    },
    openInfo() {
      this.$store.commit('users/SET_OPEN_INFO', true);
    },
  },
  apollo: {
    $subscribe: {
      Progress: {
        query: DATASET_UPLOAD_SUB,
        variables() {
          return {
            uid: this.$auth.user().id,
          };
        },
        result(data) {
          this.iaOnProgress = true;
          this.processing = data.data.uploadProgress.data;
          console.log(this.processing);
          // this.progress = data.data.uploadProgress.data;
          // if (this.progress === 'eot') {
          //   this.close();
          // }
        },
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
  .q-layout-drawer
    z-index 6200
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
  .ia-processing
    color #E91E63
    // animation blinker 3s linear infinite
  .project-container
    display flex
    justify-content center
</style>
