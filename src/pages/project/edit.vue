<template>
  <div class="main-card row justify-center">
    <div class="col-12">
      <h2>Edition du projet "{{ project.name }}"</h2>
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
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn  outline
                  @click="save()"
                  color="primary"
                  align="right"
                  icon="save"
                  label="enregistrer"/>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 padding">
      <q-card indent style="background-color: white;">
        <q-card-title>
          <strong>Question et réponses</strong>
        </q-card-title>
        <q-card-main>
          <div class="row">
            <div class="col-12">
              <q-field>
                <q-input stack-label="Question" v-model="project.question" />
              </q-field>
            </div>
            <div v-for="(answer, index) in project.answers" :key="index"
                 class="col-12 padding">
              <q-field>
                <q-input :stack-label="`réponse ${index+1}`" v-model="answer.text" />
              </q-field>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn  @click="save()"
                  outline
                  color="primary"
                  align="right"
                  icon="save"
                  label="enregistrer"/>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 padding">
      <q-card style="background-color: white;">
        <q-card-title>
          <strong>Jeux de données à qualifier</strong>
        </q-card-title>
        <q-card-main>
          <div class="row justify-around">
            <div>
              <q-btn color="primary" icon="cloud" label="Importer depuis mon compte Dropbox" />
            </div>
            <div>
              <q-btn color="primary"
                     icon="important_devices"
                     label="Importer depuis mon ordinateur" />
            </div>
          </div>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
import omitDeep from 'omit-deep-lodash';
import { clone } from 'quasar';
import { PROJECT_QUERY, PROJECT_UPDATE } from '../../constants/graphql';

export default {
  name: 'ProjectEdit',
  data() {
    return {
      id: this.$route.params.id,
      project: {},
    };
  },
  methods: {
    save() {
      this.$apollo.mutate({
        mutation: PROJECT_UPDATE,
        variables: {
          id: this.id,
          name: this.project.name,
          question: this.project.question,
          answers: this.project.answers,
        },
      }).then(() => {
        this.$localStorage.set('projectName', this.project.name);
        this.$root.$emit('projectUpdated', {
          id: this.id,
          name: this.project.name,
        });
        this.$q.notify(this.$t('global.updateDone'));
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  apollo: {
    project: {
      query: PROJECT_QUERY,
      variables() {
        return {
          id: this.id,
        };
      },
      update(data) {
        let project = clone(data.Project);
        project = omitDeep(project, ['__typename']);
        return project;
      },
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
