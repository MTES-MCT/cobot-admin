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
            Mes projets
          </div>
          <div class="col-6" style="text-align:right">
            <a href="javascript:void(0)" @click="goToNewProject()">ajouter un projet</a>
          </div>
        </div>
      </q-list-header>
      <q-collapsible v-for="(project, index) in Me.projects"
                    :key="`project_${index}`"
                    :label="project.name"
                    group="project"
                    icon="receipt">
        <div class="links">
          <ul>
            <li @click="goToDashboard(project)">aller au projet</li>
            <li @click="goToEditProject(project)">éditer le projet</li>
            <li v-if="isSegmentEditor" @click="onEditSegment(project)">éditer les segments</li>
            <li @click="onDeleteProject(project)">supprimer le projet</li>
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
import { ME_QUERY, PROJECT_DELETE } from '../constants/graphql';

import CcEditProject from './cc-edit-project';

export default {
  name: 'CcMenu',
  components: {
    CcEditProject,
  },
  computed: {
    isSegmentEditor() {
      if (localStorage.getItem('sig_auth_token')) {
        return true;
      }
      return false;
    },
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
      delete project.__typename;
      this.$store.commit('project/SET_PROJECT', project);
      this.$store.dispatch('dataset/setData', null);
      this.$store.dispatch('dataset/setDataset', null);
      this.$store.dispatch('dataset/setDatasetId', project.id);
      this.$localStorage.set('project', JSON.stringify(project));
      this.$root.$emit('projectChanged', project);
      this.$router.push(`/dashboard/${project.id}`);
    },
    goToEditProject(project) {
      delete project.__typename;
      this.$store.commit('project/SET_PROJECT_ID', project.id);
      // this.$store.commit('users/SET_OPEN_EDIT_PROJECT', true);
      this.$store.commit('project/SET_PROJECT', project);
      this.$localStorage.set('project', JSON.stringify(project));
      this.$root.$emit('projectChanged', project);
      this.$router.push(`/project/${project.id}`);
    },
    goToNewProject() {
      this.$store.commit('project/SET_PROJECT_ID', null);
      // this.$store.commit('users/SET_OPEN_EDIT_PROJECT', true);
      this.$router.push('/project');
    },
    goToCobot() {
      this.$router.push('/crud');
    },
    onDeleteProject(project) {
      this.$q.dialog({
        title: 'Suppression',
        message: `Pour définitivement supprimer ce projet saisissez son nom : ${project.name}`,
        prompt: {
          model: '',
        },
        ok: {
          color: 'pink',
          label: 'supprimer',
        },
        cancel: {
          color: 'grey',
          label: 'annuler',
        },
        preventClose: true,
      }).then(async (name) => {
        if (name === project.name) {
          this.$root.$emit('projectDeleted', project);
          try {
            await this.$apollo.mutate({
              mutation: PROJECT_DELETE,
              variables: {
                id: project.id,
              },
            });
            if (!this.$route.params.id || this.$route.params.id === project.id) {
              const projects = JSON.parse(this.$localStorage.get('projects'));
              const newProjects = _.reject(projects, newProject => newProject.name === name);
              this.$localStorage.set('projects', JSON.stringify(newProjects));
              this.$localStorage.set('project', JSON.stringify(newProjects[0]));

              this.$store.commit('project/SET_PROJECT_ID', newProjects[0].id);
              this.$store.commit('project/SET_PROJECT', newProjects[0]);
              this.$root.$emit('projectChanged', newProjects[0]);
              this.$router.push({ path: `/#/dashboard/${newProjects[0].id}` });
            }
          } catch (e) {
            console.log(e);
          }
        }
      }).catch(() => {
      });
    },
    onEditSegment(project) {
      delete project.__typename;
      this.$store.commit('project/SET_PROJECT', project);
      this.$localStorage.set('project', JSON.stringify(project));
      this.$root.$emit('projectChanged', project);
      this.$router.push(`/gis/${project.id}`);
    },
  },
  apollo: {
    Me: {
      query: ME_QUERY,
      fetchPolicy: 'no-cache',
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
