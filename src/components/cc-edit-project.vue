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
          <q-stepper color="pink" ref="stepper" style="height: 355px;">
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
              <q-chips-input v-model="labels"
                             @input="onLabel"
                             color="pink"
                             float-label="Labels recherchés" />
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

// PROJECT_UPDATE, PROJECT_DELETE
import { PROJECT_QUERY, PROJECT_CREATE, PROJECT_UPDATE } from '../constants/graphql';

export default {
  name: 'CcEditProject',
  computed: {
    ...mapState('users', ['openEditProject']),
    ...mapState('project', ['projectId']),
  },
  data() {
    return {
      skipQuery: true,
      labels: [],
      project: {
        name: null,
        details: null,
      },
    };
  },
  watch: {
    projectId() {
      // this.$refs.stepper.goToStep('etape1');
      if (this.projectId) {
        this.$apollo.queries.project.skip = false;
      }
    },
  },
  methods: {
    getLabels(projectLabels) {
      const labels = [];
      _.each(projectLabels, (label) => {
        labels.push(label.text);
      });
      return labels;
    },
    goTo(to, id) {
      this.$store.commit('project/SET_PROJECT', this.project);
      this.$localStorage.set('project', JSON.stringify(this.project));
      this.$root.$emit('projectChanged', this.project);

      this.$router.push({ name: to, params: { id } });
      this.$store.commit('users/SET_OPEN_EDIT_PROJECT', false);
    },
    onNext() {
      if (this.projectId) {
        this.update();
        this.$refs.stepper.next();
      } else {
        this.save();
        this.$refs.stepper.next();
      }
    },
    onLabel() {
      this.project.labels = [];
      _.each(this.labels, (label, index) => {
        this.project.labels.push({
          text: label,
          order: index,
        });
      });
      this.update();
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
        this.$localStorage.set('project', this.project);
        this.$root.$emit('projectUpdated', {
          id: this.projectId,
          name: this.project.name,
        });
        this.$q.notify({ message: this.$t('global.updateDone'), type: 'grey' });
      }).catch(() => {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      });
    },
    close() {
      this.$store.commit('users/SET_OPEN_EDIT_PROJECT', false);
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
          this.labels = this.getLabels(project.labels);
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
    .q-stepper-nav
      position absolute
      bottom 10px
      right 0px
</style>
