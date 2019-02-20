<template>
  <q-modal v-model="opened">
    <h4>Importer depuis dropbox</h4>
    <div v-if="!imported">
      <p>Merci d'indiquer l'url du dossier partagé dans lequel se trouve votre jeu de donnée.</p>
      <q-field>
        <q-input stack-label="url" v-model="url" />
      </q-field>
    </div>
    <div v-if="imported" style="text-align: center;">
      <p>Le jeu de donnée a corectement été importé ({{ numFile }} fichiers)</p>
      <q-btn @click="gotoDataset()"
             color="primary"
             label="accèder à mon jeu de donnée" />
      <q-btn @click="$emit('update:opened', false)"
             color="negative"
             label="fermer"
             style="margin-left: 10px;" />
    </div>
    <q-inner-loading :visible="isLoading">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
    <div class="padding" v-if="!imported">
      <q-btn @click="upload()"
             color="primary"
             label="importer" />
      <q-btn color="negative"
             @click="$emit('update:opened', false)"
             label="annuler"
             style="margin-left: 10px;" />
    </div>
  </q-modal>
</template>

<script>
export default {
  name: 'CcUploadFromDropbox',
  props: ['projectId', 'projectName', 'question', 'answers', 'opened'],
  data() {
    return {
      isLoading: false,
      imported: false,
      numFile: null,
      url: '',
    };
  },
  methods: {
    async upload() {
      if (this.checkUrl()) {
        this.isLoading = true;
        this.url = this.url.replace(/\?dl=0/, '?dl=1');
        const result = await this.axios.post('/dropbox', {
          url: this.url,
          id: this.projectId,
          projectName: this.projectName,
          question: this.question,
          answers: this.answers,
        });
        if (result && result.data) {
          this.isLoading = false;
          this.imported = true;
          this.numFile = result.data.length;
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
  },
};
</script>

<style scopped lang="stylus">
  .padding
    padding-top: 15px;
  .modal-content
    padding 20px
    h4
      -webkit-margin-before: 0
      -webkit-margin-after: 1
</style>
