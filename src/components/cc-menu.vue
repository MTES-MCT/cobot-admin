<template>
  <q-list
    no-border
    link
    inset-delimiter
    separator
  >
    <q-collapsible indent icon="mail" label="mes projets" opened>
      <q-item v-for="project in Me.projects"
              :key="project.id"
              link>
        <q-item-main>
          <q-item-tile
            @click.native="goToDashboard(project.name)"
            label>{{ project.name }}</q-item-tile>
          <q-item-tile
            @click.native="goToEditProject(project.id)"
            sublabel>Edit</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-if="$auth.check(100)" @click.native="goToNewProject()">
        <q-btn outline
                color="primary"
                label="ajouter un projet" />
      </q-item>
    </q-collapsible>
    <q-item>
      <q-item-side icon="people" />
      <q-item-main label="Mon compte" />
    </q-item>
    <q-item v-if="$auth.check(100)" @click.native="goToCobot()">
      <q-item-side icon="language" />
      <q-item-main label="Messages de Cobot" />
    </q-item>
  </q-list>
</template>

<script>
import _ from 'lodash';
import { clone } from 'quasar';
import { ME_QUERY } from '../constants/graphql';

export default {
  name: 'CcMenu',
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
  methods: {
    slug(name) {
      return name.replace(/\s/g, '').toLowerCase();
    },
    goToDashboard(project) {
      const projectSlug = this.slug(project);
      this.$localStorage.set('projectName', project);
      this.$router.push(`/dashboard/${projectSlug}`);
    },
    goToEditProject(id) {
      this.$router.push(`/project/${id}`);
    },
    goToNewProject() {
      this.$router.push('/project');
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
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
</style>
