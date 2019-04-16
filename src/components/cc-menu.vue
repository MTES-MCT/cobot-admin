<template>
  <div>
    <q-list
      no-border
      link
      inset-delimiter
      separator
      class="menu"
    >
      <q-list-header>
        <div class="row">
          <div class="col-6">
            Mes projects
          </div>
          <div class="col-6" style="text-align:right">
            <a href="javascript:void(0)" @click="goToNewProject()">ajouter un projet</a>
          </div>
        </div>
      </q-list-header>
      <q-collapsible v-for="project in Me.projects"
                    :key="project.id"
                    :label="project.name"
                    group="project"
                    icon="receipt">
        <div class="links">
          <ul>
            <li @click="goToDashboard(project)">aller au projet</li>
            <li @click="goToEditProject(project.id)">éditer le projet</li>
          </ul>
        </div>
      </q-collapsible>
      <q-item v-if="$auth.check(110)" @click.native="goToCobot()">
        <q-item-side icon="language" />
        <q-item-main label="Messages de Cobot" />
      </q-item>
    </q-list>
    <ccEditProject />
  </div>
</template>

<script>
import _ from 'lodash';
import { clone } from 'quasar';
import { ME_QUERY } from '../constants/graphql';

import CcEditProject from './cc-edit-project';

export default {
  name: 'CcMenu',
  components: {
    CcEditProject,
  },
  data() {
    return {
      Me: {
        projects: [],
      },
    };
  },
  created() {
    this.$root.$on('projectUpdated', (project) => {
      const projectKey = _.findKey(this.Me.projects, {
        id: project.id,
      });
      this.Me.projects[projectKey].name = project.name;
    });
    this.$root.$on('projectDeleted', (deletedProject) => {
      this.Me.projects = _.filter(this.Me.projects, (project => project.id !== deletedProject.id));
    });
    this.$root.$on('newProject', (project) => {
      this.Me.projects.push(project);
    });
  },
  mounted() {
    const project = JSON.parse(this.$localStorage.get('project'));
    delete project.__typename;
    delete project.__typename;
    _.each(project.answers, (answer) => {
      delete answer._id;
      delete answer.__typename;
    });
    this.$store.dispatch('project/setProject', project);
  },
  methods: {
    slug(name) {
      return name.replace(/\s/g, '').toLowerCase();
    },
    goToDashboard(project) {
      this.$store.commit('project/SET_PROJECT', project);
      this.$localStorage.set('project', JSON.stringify(project));
      this.$root.$emit('projectChanged', project);
      this.$router.push(`/dashboard/${project.id}`);
    },
    goToEditProject(projectId) {
      this.$store.commit('project/SET_PROJECT_ID', projectId);
      this.$store.commit('users/SET_OPEN_EDIT_PROJECT', true);
      // this.$router.push(`/project/${id}`);
    },
    goToNewProject() {
      this.$store.commit('project/SET_PROJECT_ID', null);
      this.$store.commit('users/SET_OPEN_EDIT_PROJECT', true);
      // this.$router.push('/project');
    },
    goToCobot() {
      this.$router.push('/crud');
    },
  },
  apollo: {
    Me: {
      query: ME_QUERY,
      update(data) {
        return clone(data.Me);
      },
      error() {
        this.$router.push({ path: '/auth/login' });
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
    .menu
      height: calc(100vh - 55px);
      .links
        ul
          list-style-type none
          margin 0
          padding-left 0
          padding-bottom 10px
          li
            line-height 2rem
            padding-left 65px
            color $pink
            &:hover
              cursor pointer
              background lightgrey
      a
        color $pink
        text-decoration none
        &:hover
          text-decoration underline
      .q-collapsible-sub-item
        padding 0
</style>
