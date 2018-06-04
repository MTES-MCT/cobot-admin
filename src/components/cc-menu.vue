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
              link
              @click.native="goToDashboard(project.name)">
        <q-item-main :label="project.name" />
        <!-- sublabel="1 283 contributions"  -->
      </q-item>
      <q-item @click.native="goToNewProject()">
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
  methods: {
    slug(name) {
      return name.replace(/\s/g, '').toLowerCase();
    },
    goToDashboard(project) {
      const projectSlug = this.slug(project);
      this.$localStorage.set('projectName', project);
      this.$router.push(`/dashboard/${projectSlug}`);
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
        return data.Me;
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
</style>
