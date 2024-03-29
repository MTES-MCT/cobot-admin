<template>
  <div>
    <cc-subheader-user :numItem="contributors.length" />
    <div class="row main">
      <div class="col-3">
        <cc-left-panel-user />
      </div>
      <div class="col-9">
        <div class="main-card row justify-center">
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
          <q-modal v-model="opened">
            <q-modal-layout>
              <q-toolbar color="dark" slot="header">
                <q-toolbar-title>
                  Créer des contributeurs
                </q-toolbar-title>
              </q-toolbar>
              <div class="layout-padding">
                Ajouter des adresses email séparées par des ";"
                pour créer de nouveaux contributeurs.
                <q-input v-model="contributorsEmail"
                  type="textarea"
                  float-label="Liste d'email"
                  :max-height="50"
                  rows="4" />
              </div>
              <q-toolbar style="text-align: right;" color="white" slot="footer">
                <q-toolbar-title>
                  <q-btn color="pink"
                         label="ajouter"
                         @click="addContributors()"
                         style="margin-right: 10px;" />
                  <q-btn color="grey"
                         label="annuler"
                         @click="opened = false" />
                </q-toolbar-title>
              </q-toolbar>
            </q-modal-layout>
          </q-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-useless-escape: 0 */
import { clone } from 'quasar';
import _ from 'lodash';
import moment from 'moment';
import CcContributorsTable from 'components/cc-contributors-table';
import { PROJECT_CONTRIBUTORS, DELETE_PROJECT_CONTRIBUTOR, PROJECT_CREATE_CONTRIBUTOR, PROJECT_UPDATE_CONTRIBUTOR_ROLE } from '../../constants/graphql';

import CcLeftPanelUser from 'components/cc-left-panel-user';
import CcSubheaderUser from 'components/cc-subheader-user';

export default {
  name: 'DashboardContributors',
  components: {
    CcContributorsTable,
    CcLeftPanelUser,
    CcSubheaderUser,
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
          style: 'width: 250px; padding-left: 12px; padding-right: 12px;',
        },
        {
          name: 'role',
          required: true,
          label: 'Droits',
          align: 'left',
          action: this.onChangeRole,
          // field: row => row.projects,
          sortable: true,
          style: 'width: 210px; padding-left: 12px; padding-right: 12px;',
        },
        {
          name: 'isPro',
          required: true,
          label: 'Shoot Pro',
          align: 'left',
          action: this.onChangeRole,
          // field: row => row.currentProject.isPro,
          sortable: true,
          style: 'width: 100px; padding-left: 12px; padding-right: 12px;',
        },
        {
          name: 'lastConnection',
          required: true,
          label: 'Dernière connexion',
          align: 'left',
          field: (row) => {
            if (row.lastConnection) {
              return moment(row.lastConnection).format('DD.MM.YY');
            }
            return '-';
          },
          sortable: true,
          style: 'padding-left: 12px; padding-right: 12px; width: 150px;',
        },
        {
          name: 'photos',
          required: true,
          label: 'Nb photos',
          align: 'left',
          field: 'photos',
          sortable: true,
          style: 'padding-left: 12px; padding-right: 12px; width: 150px;',
        },
        {
          name: 'labels',
          required: true,
          label: 'Nb détourage',
          align: 'left',
          field: 'labels',
          sortable: true,
          style: 'padding-left: 12px; padding-right: 12px; width: 150px;',
        },
        {
          name: 'action',
          align: 'right',
          filter: false,
          sort: false,
          style: 'padding-left: 12px; padding-right: 12px; width: 150px;',
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
    this.$root.$on('onAddUser', () => {
      this.opened = true;
    });
  },
  methods: {
    addContributors() {
      const emails = this.contributorsEmail.split(';');
      _.each(emails, async (email) => {
        if (this.isEmailValid(email.trim())) {
          await this.createContributor(email.trim());
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
              role: user.project.role,
              isPro: user.project.isPro,
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
          projectId: this.projectId,
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
    width 100%
    max-width 1200px
    padding 20px
  // .padding
  //   padding-top 20px
  // .modal-content
  //   padding 20px
  //   h4
  //     -webkit-margin-before: 0
  //     -webkit-margin-after: 1
</style>
