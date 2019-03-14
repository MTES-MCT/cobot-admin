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
       <q-inner-loading :visible="isLoading">
        <q-spinner-gears size="50px" color="pink"></q-spinner-gears>
      </q-inner-loading>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CcUploadFromDropbox',
  props: ['projectId', 'projectName', 'question', 'answers', 'opened'],
  computed: {
    ...mapState('project', ['project']),
  },
  data() {
    return {
      isLoading: false,
      imported: false,
      numFile: null,
      url: 'https://www.dropbox.com/sh/j569sehelgrcf3b/AACQhZahSS8OPTAaFIXYMUVGa?dl=0',
    };
  },
  methods: {
    async upload() {
      console.log(this.project);
      if (this.checkUrl()) {
        this.isLoading = true;
        this.url = this.url.replace(/\?dl=0/, '?dl=1');
        const result = await this.axios.post('/dropbox', {
          url: this.url,
          // projectId: this.project.id,
          // projectName: this.project.name,
          // question: this.project.question,
          // answers: JSON.stringify(this.project.answers),
        });
        if (result && result.data) {
          this.isLoading = false;
          this.imported = true;
          this.numFile = result.data.length;
          this.$root.$emit('update:imported');
        }
      } else {
        this.$q.notify({
          message: 'L\'url saisie ne semble pas valide',
          timeout: 3000,
          type: 'negative',
          position: 'center',
          closeBtn: 'fermer',
        });
      }
      return false;
    },
    checkUrl() {
      return this.url && this.url.indexOf('dropbox.com') > -1 && this.url.indexOf('?dl=') > -1;
    },
    gotoDataset() {
      const slug = this.projectName.replace(/\s/g, '').toLowerCase();
      this.$router.push(`/dashboard/dataset/${slug}`);
    },
    close() {
      this.isLoading = false;
      this.$emit('update:opened', false);
    },
  },
};
</script>

<style scopped lang="stylus">
</style>
