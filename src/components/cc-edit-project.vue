<template>
  <q-modal v-model="openEditProject"
           minimized
           class="editProject">
      <q-modal-layout>
        <q-toolbar color="dark" slot="header">
          <q-toolbar-title>
            Edition du projet
          </q-toolbar-title>
        </q-toolbar>
        <div class="layout-padding">
          <q-stepper v-model="currentStep" color="pink" ref="stepper" style="height: 555px;">
            <q-step name="etape1" default title="Etape 1" subtitle="Projet">
              <q-field>
                <q-input stack-label="Nom du projet" v-model="project.name" />
              </q-field>
              <q-field>
                <q-input stack-label="Detail du projet"
                         type="textarea"
                         :max-height="50"
                         rows="4"
                         v-model="project.details" />
              </q-field>
            </q-step>

            <q-step name="etape2" title="Etape 2" subtitle="Labels">
              <q-field>
                <q-input stack-label="Ajouter un élément" v-model="label" />
              </q-field>
              <div class="row" style="padding-top: 12px;">
                <q-chip v-for="(label, index) in project.labels"
                        :key="`project_${index}`"
                        icon="create"
                        closable
                        color="pink"
                        @hide="onDeleteLabel"
                        @click="onEditLabel"
                        class="label">
                  {{ label.text }}
                </q-chip>
              </div>
              <!-- v-for="(project, index) in Me.projects"
                    :key="`project_${index}`" -->
              <!-- <q-chips-input v-model="labels"
                             @input="onLabel"
                             color="pink"
                             float-label="Labels recherchés" /> -->
            </q-step>

            <q-step title="Etape 3"
                    subtitle="Contributeurs et jeux de données"
                    style="text-align: center;">
               <q-btn
                color="grey"
                @click="goTo('dashboard.dataset', projectId)"
                label="éditer mon jeu de données"
                style="margin-right: 10px;"
              />
              <q-btn
                color="grey"
                @click="goTo('dashboard.contributors', projectId)"
                label="gérer mes contributeurs"
              />
            </q-step>

            <q-stepper-navigation>
              <q-btn
                color="grey"
                @click="$refs.stepper.previous()"
                label="retour"
                style="margin-right: 10px;"
              />
              <q-btn
                color="pink"
                @click="onNext()"
                label="suivant"
              />
            </q-stepper-navigation>
          </q-stepper>
        </div>
        <q-toolbar style="text-align: right;" color="white" slot="footer">
          <q-toolbar-title>
            <q-btn color="grey"
                  @click="close()"
                  label="fermer" />
            <q-btn v-if="projectId"
                   color="negative"
                   @click="onDelete()"
                   label="supprimer le projet"
                   style="margin-left: 10px;" />
          </q-toolbar-title>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import omitDeep from 'omit-deep-lodash';
import { clone } from 'quasar';

import { PROJECT_QUERY, PROJECT_CREATE, PROJECT_UPDATE, PROJECT_DELETE } from '../constants/graphql';

export default {
  name: 'CcEditProject',
  computed: {
    ...mapState('users', ['openEditProject']),
    ...mapState('project', ['projectId']),
  },
  data() {
    return {
      skipQuery: true,
      label: null,
      labels: [],
      currentStep: 'etape1',
      currentProject: null,
      project: {
        name: null,
        details: null,
      },
    };
  },
  watch: {
    projectId() {
      if (this.projectId) {
        this.$apollo.queries.project.skip = false;
      }
    },
    project() {
      if (!this.currentProject) {
        this.currentProject = clone(this.project);
      }
    },
  },
  methods: {
    // getLabels(projectLabels) {
    //   const labels = [];
    //   _.each(projectLabels, (label) => {
    //     labels.push(label.text);
    //   });
    //   return labels;
    // },
    goTo(to, id) {
      this.$store.dispatch('dataset/setData', null);
      this.$store.dispatch('dataset/setDataset', null);
      this.$store.dispatch('dataset/setDatasetId', this.project.id);

      this.$store.commit('project/SET_PROJECT', this.project);
      this.$localStorage.set('project', JSON.stringify(this.project));
      this.$root.$emit('projectChanged', this.project);

      this.$router.push({ name: to, params: { id } });
      this.$store.commit('users/SET_OPEN_EDIT_PROJECT', false);
    },
    onNext() {
      if (this.projectId) {
        switch (this.currentStep) {
          case 'etape1':
            if (this.project.name !== this.currentProject.name) {
              this.update();
            }
            this.$refs.stepper.next();
            break;
          case 'etape2':
            console.log(this.project.labels);
            // this.update();
            // this.$refs.stepper.next();
            break;
          default:
            this.$refs.stepper.next();
        }
      } else {
        this.save();
        this.$refs.stepper.next();
      }
    },
    onLabel() {
      console.log('je passe');
      this.project.labels = [];
      _.each(this.labels, (label, index) => {
        this.project.labels.push({
          text: label,
          order: index,
        });
      });
      // this.update();
    },
    async save() {
      if (this.project.name) {
        try {
          const newProject = await this.$apollo.mutate({
            mutation: PROJECT_CREATE,
            variables: {
              name: this.project.name,
              details: this.project.details,
            },
          });
          if (newProject) {
            this.$store.commit('project/SET_PROJECT_ID', newProject.data.createProject.id);
            this.$root.$emit('newProject', newProject.data.createProject);
          }
        } catch (error) {
          this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
        }
      } else {
        this.$q.dialog({
          title: 'Erreur',
          message: 'Merci de renseigner le champ "nom du projet"',
          color: 'pink',
        });
      }
    },
    update() {
      this.$apollo.mutate({
        mutation: PROJECT_UPDATE,
        variables: {
          id: this.projectId,
          name: this.project.name,
          question: this.project.question,
          answers: this.project.answers,
          labels: this.project.labels,
        },
      }).then(() => {
        this.$localStorage.set('project', JSON.stringify(this.project));
        this.$root.$emit('projectUpdated', {
          id: this.projectId,
          name: this.project.name,
        });
        this.$q.notify({ message: this.$t('global.updateDone'), type: 'positive' });
      }).catch(() => {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      });
    },
    close() {
      this.$store.commit('users/SET_OPEN_EDIT_PROJECT', false);
    },
    onDelete() {
      this.$q.dialog({
        title: 'Suppression d\'un projet',
        message: 'Etes-vous sûr de vouloir supprimer l\'ensemble du projet (contributions, contributeur et données) ?',
        ok: {
          color: 'negative',
          label: this.$t('global.yes'),
        },
        cancel: {
          color: 'grey',
          label: this.$t('global.no'),
        },
        preventClose: true,
      }).then(() => {
        this.$apollo.mutate({
          mutation: PROJECT_DELETE,
          variables: {
            id: this.projectId,
          },
        }).then(() => {
          let projects = this.$localStorage.get('projects');
          if (projects) {
            projects = JSON.parse(projects);
            projects = _.filter(projects, (project => project.id !== this.projectId));
            this.$localStorage.set('projects', JSON.stringify(projects));
            [this.project] = projects;
            this.$root.$emit('projectDeleted', { id: this.projectId });
            this.goTo('dashboard', this.project.id);
          }
        }).catch((error) => {
          console.log(error);
        });
      });
    },
  },
  apollo: {
    project: {
      query: PROJECT_QUERY,
      variables() {
        return {
          id: this.projectId,
        };
      },
      update(data) {
        if (data.Project) {
          let project = clone(data.Project);
          project = omitDeep(project, ['__typename']);
          // this.labels = this.getLabels(project.labels);
          return project;
        }
        return false;
      },
      skip() {
        return this.skipQuery;
      },
    },
  },
};
</script>

<style lang="stylus">
  .editProject
    .modal-content
      width 50vw
      height 50vw
    .q-stepper-nav
      position absolute
      bottom 10px
      right 0px
    .label
      margin-right 12px
      margin-bottom 12px
</style>
