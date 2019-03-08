<template>
  <div class="main-card row justify-center">
    <div class="col-12" style="text-align: center">
      <h4>Contributeurs - {{ projectName }}</h4>
    </div>
    <div class="col-12 bg-white">
      <cc-contributors-table
        style=""
        v-if="contributors.length > 0"
        :projectId="projectId"
        :config="tableConfig"
        :columns="columns"
        :datas="contributors"
        :actions="actions"
        :filter="filter"/>
    </div>
    <div class="col-12" style="text-align: center;">
        <q-btn color="primary"
               label="créer l'accès à de nouveaux contributeurs"
               @click="opened = true"
               style="margin-top: 20px;"/>
    </div>
    <q-modal v-model="opened">
      <h4>Créer des contributeurs</h4>
      <p>Ajouter des adresses email séparées par des ";" pour créer de nouveaux contributeurs.</p>
      <q-input v-model="contributorsEmail"
               type="textarea"
               float-label="Liste d'email"
               :max-height="50"
               rows="4" />
      <div class="padding">
        <q-btn color="primary"
               label="ajouter"
               @click="addContributors()"
               style="margin-right: 10px;" />
        <q-btn color="negative"
               label="annuler" />
      </div>
  </q-modal>
  </div>
</template>

<script>
/* eslint no-useless-escape: 0 */
import { clone } from 'quasar';
import _ from 'lodash';
import CcContributorsTable from 'components/cc-contributors-table';
import { PROJECT_CONTRIBUTORS, DELETE_PROJECT_CONTRIBUTOR, PROJECT_CREATE_CONTRIBUTOR, PROJECT_UPDATE_CONTRIBUTOR_ROLE } from '../../constants/graphql';

export default {
  name: 'DashboardContributors',
  components: {
    CcContributorsTable,
  },
  data() {
    return {
      contributors: [],
      contributorsEmail: '',
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      opened: false,
      projectId: this.$route.params.id,
      projectName: null,
      tableConfig: {
        title: '',
        columnPicker: false,
        pagination: {
          sortBy: null,
          descending: false,
          page: 1,
          rowsPerPage: 15,
        },
        rowHeight: 50,
      },
      columns: [
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: 'email',
          sortable: true,
        },
        {
          name: 'role',
          required: true,
          label: 'Droits',
          align: 'left',
          action: this.onChangeRole,
          field: row => row.projects[0].role,
          sortable: true,
        },
        {
          name: 'action',
          align: 'right',
          filter: false,
          sort: false,
        },
      ],
      actions: [
        {
          name: 'contributors.revoke',
          id: 'email',
          color: 'negative',
          confirm: 'Etes-vous sûr de vouloir retirer les accès à cet utilisateur ?',
          gql: DELETE_PROJECT_CONTRIBUTOR,
        },
      ],
      filter: '',
    };
  },
  mounted() {
    const project = JSON.parse(this.$localStorage.get('project'));
    this.projectName = project.name;
  },
  methods: {
    addContributors() {
      const emails = this.contributorsEmail.split(';');
      _.each(emails, async (email) => {
        if (this.isEmailValid(email.trim())) {
          await this.createContributor(email);
        }
      });
      this.opened = false;
    },
    async onChangeRole(user) {
      try {
        await this.$apollo.mutate({
          mutation: PROJECT_UPDATE_CONTRIBUTOR_ROLE,
          variables: {
            email: user.email,
            projects: {
              id: this.projectId,
              role: user.projects[0].role,
            },
          },
        });
        this.$q.notify({ message: 'Droit mis à jour !', type: 'positive' });
      } catch (error) {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      }
    },
    isEmailValid(email) {
      return this.reg.test(email);
    },
    async createContributor(email) {
      try {
        const newContributor = await this.$apollo.mutate({
          mutation: PROJECT_CREATE_CONTRIBUTOR,
          variables: {
            id: this.projectId,
            email,
            role: 1,
          },
        });
        if (newContributor) {
          this.contributors.push({
            email: newContributor.data.createProjectContributor.email,
            projects: newContributor.data.createProjectContributor.projects,
          });
        }
      } catch (error) {
        this.$q.notify({ message: this.$t('global.error'), type: 'negative' });
      }
    },
  },
  apollo: {
    contributors: {
      query: PROJECT_CONTRIBUTORS,
      variables() {
        return {
          id: this.projectId,
        };
      },
      update(data) {
        return clone(data.ProjectContributors);
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
    margin-bottom: 40px;
  .padding
    padding-top 20px
  .modal-content
    padding 20px
    h4
      -webkit-margin-before: 0
      -webkit-margin-after: 1
</style>
