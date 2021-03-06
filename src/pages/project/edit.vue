<template>
  <div class="main-card">
    <div class="row no-wrap">
      <div class="col bg-white edit-project">
        <q-stepper v-model="currentStep" color="pink" ref="stepper">
          <q-step name="etape1" default title="Projet">
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

          <q-step name="etape2" title="Labels">
            <q-field v-if="!isEditLabel">
              <q-input
                v-model="label"
                @keyup="onKeyUp"
                stack-label="Ajouter un élément"
                :after="[
                  {
                    icon: 'send',
                    error: false,
                    handler: () => {
                      this.onAddLabel();
                    }
                  }
                ]" />
            </q-field>
            <div v-if="!isEditLabel" class="row" style="padding-top: 12px;">
              <q-chip v-for="(label, index) in project.labels"
                      :key="`project_${index}`"
                      icon="create"
                      closable
                      :color="(label.text === 'no-detected') ? 'black' : 'pink'"
                      @hide="onDeleteLabel(label)"
                      @click="onEditLabel(label)"
                      class="label">
                {{ label.text }}
                <span v-if="label.properties && label.properties.length > 0">
                  ({{ label.properties.length }})
                </span>
              </q-chip>
            </div>
            <div v-else>
              <div class="row">
                <div class="col labelHeader">
                  <img v-if="currentLabel.img" :src="`https://labelbot-api.wawy.io/img/${projectId}/labels/icons/${setLabelIcon(currentLabel.img)}`" />
                  <span>{{ currentLabel.text }}</span>
                </div>
                <div class="col" style="text-align:right;">
                  <q-btn @click="onCloseEditLabel" round size="sm" color="grey">
                    <q-icon name="close" />
                  </q-btn>
                </div>
              </div>
              <div class="row labelProps">
                <div class="col">
                  <div class="q-pa-md">
                    <q-table
                      title="Propriétés"
                      :data="currentLabel.properties"
                      :columns="labelPropsColumns"
                      row-key="name"
                    >
                      <template slot="top-right" slot-scope="props">
                        <q-btn @click="onAddLabelProperty()" label="ajouter" />
                      </template>

                      <q-tr v-if="currentProperty" slot="bottom-row" slot-scope="props">
                        <q-td colspan="100%" style="text-align: right;">
                          <q-btn size="sm" color="grey" label="annuler"
                                  @click="onCancelEditLabelProperty()"
                                  style="margin-right: 12px;" />
                          <q-btn size="sm" color="pink" label="valider"
                                 @click="onSaveLabelProperty()"
                                 style="margin-right: 12px;"  />
                          <q-btn size="sm" color="warning" label="supprimer"
                                 @click="onDeleteLabelProperty()" />
                        </q-td>
                      </q-tr>

                      <q-tr @click.native="onEditLabelProperty(props.row)"
                            slot="body" slot-scope="props" :props="props">
                        <q-td key="name" :props="props">
                          <template v-if="!props.row.edit">
                            {{ props.row.name }}
                          </template>
                          <template v-else>
                            <q-input autofocus v-model="props.row.name" />
                          </template>
                        </q-td>
                        <q-td key="val_1" :props="props">
                          <template v-if="!props.row.edit">
                            {{ props.row.val_1 }}
                          </template>
                          <template v-else>
                            <q-input v-model="props.row.val_1" />
                          </template>
                        </q-td>
                        <q-td key="val_2" :props="props">
                          <template v-if="!props.row.edit">
                            {{ props.row.val_2 }}
                          </template>
                          <template v-else>
                            <q-input v-model="props.row.val_2" />
                          </template>
                        </q-td>
                        <q-td key="val_3" :props="props">
                          <template v-if="!props.row.edit">
                            {{ props.row.val_3 }}
                          </template>
                          <template v-else>
                            <q-input v-model="props.row.val_3" />
                          </template>
                        </q-td>
                      </q-tr>
                    </q-table>
                  </div>
                </div>
              </div>
            </div>
          </q-step>

          <!-- <q-step title="Etape 3"
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
          </q-step> -->

          <q-stepper-navigation>
            <q-btn
              color="grey"
              @click="onGoBack()"
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import omitDeep from 'omit-deep-lodash';
import { clone } from 'quasar';

import { PROJECT_QUERY, PROJECT_CREATE, PROJECT_UPDATE, PROJECT_DELETE } from '../../constants/graphql';

export default {
  name: 'CcEditProject',
  computed: {
    ...mapState('users', ['openEditProject']),
    ...mapState('project', ['projectId']),
  },
  data() {
    return {
      skipQuery: false,
      label: null,
      labels: [],
      currentStep: 'etape1',
      currentProject: null,
      project: {
        name: null,
        details: null,
      },
      isEditLabel: false,
      currentLabel: null,
      labelPropsColumns: [
        {
          name: 'name',
          label: 'Nom',
          field: 'name',
          align: 'left',
          style: 'width: 70%',
        },
        {
          name: 'val_1',
          align: 'center',
          label: 'Valeur 1',
          field: 'val_1',
        },
        {
          name: 'val_2',
          label: 'Valeur 2',
          field: 'val_2',
        },
        {
          name: 'val_3',
          label: 'Valeur 3',
          field: 'val_3',
        },
      ],
      // labelPropsRows: [
      //   {
      //     name: 'Nombre de marches',
      //     val_1: '0 - 10',
      //     val_2: '10 - 20',
      //     val_3: '20+',
      //   },
      // ],
      currentProperty: null,
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
  mounted() {
    if (!this.projectId) {
      this.$store.commit('project/SET_PROJECT_ID', this.$route.params.id);
    }
  },
  methods: {
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
    onGoBack() {
      if (this.currentStep === 'etape2') {
        if (!this.isEditLabel) {
          this.$refs.stepper.previous();
        }
        this.onCancelEditLabelProperty();
        this.onCloseEditLabel();
      } else {
        this.$refs.stepper.previous();
      }
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
          // case 'etape2':
          //   this.update();
          //   this.$refs.stepper.next();
          //   break;
          default:
            this.$refs.stepper.next();
        }
      } else {
        this.save();
        this.$refs.stepper.next();
      }
    },
    // onLabel() {
    //   console.log('je passe');
    //   this.project.labels = [];
    //   _.each(this.labels, (label, index) => {
    //     this.project.labels.push({
    //       text: label,
    //       order: index,
    //     });
    //   });
    //   // this.update();
    // },
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
    onKeyUp(event) {
      if (event.key === 'Enter') {
        this.onAddLabel();
      }
    },
    onAddLabel() {
      const lastIndex = this.project.labels.length;
      this.project.labels.push({
        text: this.label,
        order: lastIndex,
        properties: [],
      });
      this.label = '';
      this.update();
    },
    onDeleteLabel(label) {
      const labels = _.reject(this.project.labels, l => l.text === label.text);
      this.project.labels = labels;
      this.update();
    },
    onEditLabel(label) {
      this.isEditLabel = true;
      this.currentLabel = label;
    },
    setLabelIcon(image) {
      const aImage = image.split('.');
      if (aImage[1].indexOf('png') === -1) {
        return `${aImage[0]}.png`;
      }
      return image;
    },
    onCloseEditLabel() {
      this.isEditLabel = false;
      this.currentLabel = null;
    },
    onEditLabelProperty(property) {
      this.currentProperty = property;
      property.edit = true;
    },
    onCancelEditLabelProperty() {
      if (this.currentProperty) {
        if (this.currentProperty.name.length === 0) {
          this.currentLabel.properties = _.reject(
            this.currentLabel.properties,
            row => row === this.currentProperty,
          );
        }
        delete this.currentProperty.edit;
        this.currentProperty = null;
      }
    },
    onAddLabelProperty() {
      if (!this.currentProperty) {
        this.currentLabel.properties.push({
          name: '',
          val_1: '',
          val_2: '',
          val_3: '',
          edit: true,
        });
        this.currentProperty = _.last(this.currentLabel.properties);
      }
    },
    onSaveLabelProperty() {
      delete this.currentProperty.edit;
      _.each(this.currentLabel.properties, (labelPropsRows) => {
        delete labelPropsRows.__index;
      });
      // this.currentLabel.properties = this.labelPropsRows;
      this.update();
      this.currentProperty = null;
    },
    onDeleteLabelProperty() {
      if (this.currentProperty) {
        this.currentLabel.properties = _.reject(
          this.currentLabel.properties,
          properties => properties === this.currentProperty,
        );
        this.onSaveLabelProperty();
      }
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
@import '~variables'
  .main-card
    padding-top 40px
    border-radius 2px
    width 65vw
    max-width 1200px
  .edit-project
    .label
      margin-right 12px
      margin-bottom 12px
      &:hover
        cursor pointer
    .labelHeader
      align-items center
      display flex
      img
        width 40px
      span
        font-size 24px
        font-weight bold
        padding-left 24px
    .labelProps
      .title
        font-weight bold
        padding-top 24px
        font-size 18px
</style>
