<template>
  <q-modal v-model="opened">
    <q-modal-layout>
      <q-toolbar color="dark" slot="header">
        <q-toolbar-title>
          Importer depuis dropbox
        </q-toolbar-title>
      </q-toolbar>
      <div v-if="!imported" class="layout-padding">
        <p>Merci d'indiquer l'url du dossier partagé dans lequel se trouve votre jeu de donnée.</p>
        <q-field>
          <q-input stack-label="url" v-model="url" />
        </q-field>
      </div>
      <div v-if="imported" class="layout-padding" style="text-align: center;">
        <p>Le jeu de donnée a corectement été importé ({{ numFile }} fichiers)</p>
      </div>
      <q-inner-loading :visible="isLoading">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
      <q-toolbar style="text-align: right;" color="white" slot="footer">
        <q-toolbar-title>
          <div class="padding" v-if="!imported">
            <!-- <q-btn color="pink"
                  :label="progress" /> -->
            <q-btn @click="upload()"
                  color="pink"
                  label="importer" />
            <q-btn color="grey"
                   @click="close()"
                   label="annuler"
                   style="margin-left: 10px;" />
          </div>
          <div class="padding" v-if="imported">
            <q-btn @click="close()"
                   color="grey"
                   label="fermer"
                   style="margin-left: 10px;" />
          </div>
        </q-toolbar-title>
      </q-toolbar>
      <q-inner-loading class="spinner" :visible="isLoading">
        <q-spinner-gears size="50px" color="pink" />
        <p class="progress">{{ progress }}</p>
      </q-inner-loading>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex';
import { Loading, QSpinnerGears } from 'quasar';

import { DOWNLOAD_FROM_DROPBOX, DATASET_UPLOAD_SUB } from '../constants/graphql';

export default {
  name: 'CcUploadFromDropbox',
  props: ['opened'],
  components: {
    Loading,
    QSpinnerGears,
  },
  computed: {
    ...mapState('project', ['project']),
  },
  data() {
    return {
      isLoading: false,
      progress: '0 o',
      imported: false,
      numFile: null,
      url: '',
    };
  },
  methods: {
    async upload() {
      if (this.checkUrl()) {
        // this.url = this.url.replace(/\?dl=0/, '?dl=1');
        this.isLoading = true;
        this.$apollo.mutate({
          mutation: DOWNLOAD_FROM_DROPBOX,
          variables: {
            url: this.url,
            project: this.project,
          },
        });
        this.progress = 'Téléchargement en cours...';
      } else {
        this.$q.notify({
          message: 'L\'url saisie ne semble pas valide',
          timeout: 3000,
          type: 'negative',
          position: 'center',
          closeBtn: 'fermer',
        });
      }
    },
    checkUrl() {
      return true;
      // return this.url && this.url.indexOf('dropbox.com') > -1 && this.url.indexOf('?dl=') > -1;
    },
    gotoDataset() {
      const slug = this.projectName.replace(/\s/g, '').toLowerCase();
      this.$router.push(`/dashboard/dataset/${slug}`);
    },
    close() {
      this.isLoading = false;
      this.$root.$emit('update:imported');
      this.$emit('update:opened', false);
    },
  },
  apollo: {
    $subscribe: {
      Progress: {
        query: DATASET_UPLOAD_SUB,
        variables() {
          return {
            uid: this.$auth.user().id,
          };
        },
        result(data) {
          this.progress = data.data.uploadProgress.data;
          if (this.progress === 'eot') {
            this.close();
          }
        },
      },
    },
  },
};
</script>

<style scopped lang="stylus">
  .spinner
    p
      margin-top 20px
      font-weight bold
      font-size 40px
  .q-inner-loading
    .text-primary
      display none
</style>
