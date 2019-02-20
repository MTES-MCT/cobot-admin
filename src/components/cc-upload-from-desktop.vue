<template>
  <q-modal v-model="opened">
    <h4>Importer un jeu de donnée</h4>
    <q-uploader stack-label="Selectionnez les fichiers à importer"
                :url="url"
                :headers="setHeaders()"
                :additional-fields="setBody()"
                name="file"
                multiple
                @fail="fail"/>
    <div class="padding">
      <q-btn color="primary"
             @click="$emit('update:opened', false)"
             label="annuler" />
    </div>
  </q-modal>
</template>

<script>
export default {
  name: 'CcUploadFromDesktop',
  props: ['projectId', 'projectName', 'question', 'answers', 'opened'],
  data() {
    return {
      url: `${process.env.API_URL}/upload`,
    };
  },
  mounted() {
    console.log(this.answers);
  },
  methods: {
    setHeaders() {
      return { Authorization: `Bearer ${this.$localStorage.get('default_auth_token')}` };
    },
    setBody() {
      return [
        {
          name: 'projectId',
          value: this.projectId,
        },
        {
          name: 'projectName',
          value: this.projectName,
        },
        {
          name: 'question',
          value: this.question,
        },
        {
          name: 'answers',
          value: JSON.stringify(this.answers),
        },
      ];
    },
    fail(file, xhr) {
      console.log('Fail: ', file);
      console.log('Fail: ', xhr);
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
