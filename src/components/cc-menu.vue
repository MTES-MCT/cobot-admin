<template>
  <q-list
    no-border
    link
    inset-delimiter
    separator
    style="height: calc(100vh - 55px);"
  >
    <q-collapsible indent icon="mail" label="mes projets" opened>
      <!-- <q-collapsible v-for="project in Me.projects"
                     :key="project.id"
                     :label="project.name"
                     sublabel="Edit"
                     icon="receipt"> -->
      <q-item v-for="project in Me.projects"
              :key="project.id"
              link>
        <q-item-main>
          <q-item-tile
            @click.native="goToDashboard(project)"
            label>{{ project.name }}</q-item-tile>
          <q-item-tile
            v-if="$auth.check([80, 100])"
            @click.native="goToEditProject(project.id)"
            sublabel>Edit</q-item-tile>
        </q-item-main>
      </q-item>
       <!-- </q-collapsible> -->

      <q-item v-if="$auth.check(100)" @click.native="goToNewProject()">
        <q-btn color="positive"
               label="ajouter un projet" />
      </q-item>
    </q-collapsible>
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
