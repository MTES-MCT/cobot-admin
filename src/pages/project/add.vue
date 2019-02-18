<template>
  <div class="main-card row justify-center">
    <div class="col-12">
      <h2>Nouveau projet</h2>
    </div>
    <div class="col-12">
      <q-card indent style="background-color: white;">
        <q-card-title>
          <strong>Details du projet</strong>
        </q-card-title>
        <q-card-main>
          <div class="row">
            <div class="col">
            <q-field>
              <q-input stack-label="Nom du projet" v-model="project.name" />
            </q-field>
            </div>
          </div>
          <div class="row">
            <div class="col padding">
              <q-field>
                <q-input v-model="project.description"
                          type="textarea"
                          stack-label="Descriptif"
                          :max-height="50"
                          rows="4" />
            </q-field>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn  outline
                  @click="saveProject"
                  color="primary"
                  align="right"
                  icon="save"
                  label="enregistrer"/>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { PROJECT_CREATE } from '../../constants/graphql';

export default {
  name: 'ProjectAdd',
  data() {
    return {
      upldoadFromDesktop: false,
      project: {
        id: null,
        name: '',
        description: '',
        question: '',
        answers: [
          {
            text: '',
            order: 0,
          },
          {
            text: '',
            order: 1,
          },
          {
            text: '',
            order: 2,
          },
          {
            text: '',
            order: 3,
          },
          {
            text: '',
            order: 4,
          },
        ],
      },
    };
  },
  methods: {
    async saveProject() {
      try {
        const newProject = await this.$apollo.mutate({
          mutation: PROJECT_CREATE,
          variables: {
            name: this.project.name,
          },
        });
        if (newProject) {
          const { id } = newProject.data.createProject;
          this.$root.$emit('newProject', {
            id,
            name: this.project.name,
          });
          this.$router.push({ name: 'project.edit', params: { id } });
        }
      } catch (error) {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      }
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 65vw
    max-width 1200px
  .padding
    padding-top: 30px;
  .q-card
    .q-card-container
      padding 15px
</style>
