<template>
  <div>
    <div v-if="!deleted && !projectNotFound" class="main-card row justify-center">
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
        <q-card style="background-color: white;">
          <q-card-title>
            <strong>Jeux de données à qualifier</strong>
          </q-card-title>
          <q-card-main>
            <div class="row justify-around">
              <div>
                <q-btn @click="upldoadFromDropbox = true"
                       color="primary"
                       icon="cloud_download"
                       label="Importer depuis mon compte Dropbox" />
              </div>
              <div>
                <q-btn @click="upldoadFromDesktop = true"
                       color="primary"
                       icon="important_devices"
                       label="Importer depuis mon ordinateur" />
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
      <CcUploadFromDesktop v-if="id"
                           :projectId="id"
                           :projectName="project.name"
                           :question="project.question"
                           :answers="project.answers"
                           :opened.sync="upldoadFromDesktop"></CcUploadFromDesktop>
      <CcUploadFromDropbox v-if="id"
                           :projectId="id"
                           :projectName="project.name"
                           :question="project.question"
                           :answers="project.answers"
                           :opened.sync="upldoadFromDropbox"></CcUploadFromDropbox>
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
      <div class="row">
        <div class="col-12 padding">
          <q-btn  @click="confirmDelete"
                  color="negative"
                  icon="delete"
                  label="supprimer le projet"/>
        </div>
      </div>
    </div>
    <div v-if="deleted" class="main-card row justify-center">
      <div class="col-12">
        <h2 style="text-align: center">Ce projet n'existe plus</h2>
      </div>
    </div>
    <div v-if="projectNotFound" class="main-card row justify-center">
      <div class="col-12">
        <h2 style="text-align: center">Ce projet n'existe pas</h2>
      </div>
    </div>
  </div>
</template>

<script>
import omitDeep from 'omit-deep-lodash';
import { clone } from 'quasar';
import CcUploadFromDesktop from 'components/cc-upload-from-desktop';
import CcUploadFromDropbox from 'components/cc-upload-from-dropbox';
import { PROJECT_QUERY, PROJECT_UPDATE, PROJECT_DELETE } from '../../constants/graphql';

export default {
  name: 'ProjectEdit',
  components: {
    CcUploadFromDesktop,
    CcUploadFromDropbox,
  },
  data() {
    return {
      upldoadFromDesktop: false,
      upldoadFromDropbox: false,
      id: this.$route.params.id,
      deleted: false,
      projectNotFound: false,
      project: {
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
        this.$q.notify({ message: this.$t('global.updateDone'), type: 'positive' });
      }).catch(() => {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      });
    },
    confirmDelete() {
      this.$q.dialog({
        title: 'Confirmation',
        message: 'Etes-vous sûr de vouloir supprimer définitivement ce projet ?',
        ok: {
          color: 'negative',
          label: 'oui',
        },
        cancel: {
          color: 'primary',
          label: 'non',
        },
      }).then(() => {
        this.deleteProject();
      });
    },
    async deleteProject() {
      try {
        await this.$apollo.mutate({
          mutation: PROJECT_DELETE,
          variables: {
            id: this.id,
          },
        });
        this.$root.$emit('projectDeleted', {
          id: this.id,
        });
        this.deleted = true;
        this.$q.notify({ message: this.$t('project.delete'), type: 'positive' });
      } catch (error) {
        this.$q.notify({ message: this.$t('global.error'), type: 'danger' });
      }
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
        if (data.Project) {
          let project = clone(data.Project);
          project = omitDeep(project, ['__typename']);
          if (project.answers.length === 0) {
            project.answers = this.project.answers;
          }
          return project;
        }
        this.projectNotFound = true;
        return false;
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
