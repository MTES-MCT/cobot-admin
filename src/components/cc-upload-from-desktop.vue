<template>
  <q-modal v-model="opened">
    <q-modal-layout>
      <q-toolbar color="dark" slot="header">
        <q-toolbar-title>
          Importer un jeu de donnée
        </q-toolbar-title>
      </q-toolbar>
      <div class="layout-padding">
        <q-uploader stack-label="Selectionnez les fichiers à importer"
                  url=""
                  :upload-factory="uploadFile"
                  :headers="setHeaders()"
                  :additional-fields="setBody()"
                  name="file"
                  multiple
                  @fail="fail"/>
      </div>
      <q-toolbar style="text-align: right;" color="white" slot="footer">
        <q-toolbar-title>
          <q-btn color="grey"
                 @click="$emit('update:opened', false)"
                 label="annuler" />
        </q-toolbar-title>
      </q-toolbar>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import * as loadImage from 'blueimp-load-image';
import dms2dec from 'dms2dec';

export default {
  name: 'CcUploadFromDesktop',
  props: ['projectId', 'projectName', 'question', 'answers', 'opened'],
  data() {
    return {
      url: `${process.env.API_URL}/upload`,
    };
  },
  methods: {
    setHeaders() {
      return { Authorization: `Bearer ${this.$localStorage.get('default_auth_token')}` };
    },
    uploadFile(file, updateProgress) {
      loadImage.parseMetaData(
        file,
        (data) => {
          if (data.exif) {
            const exif = data.exif.getAll();
            const GPSLatitude = this.parseGpsData(exif.GPSLatitude);
            const { GPSLatitudeRef } = exif;
            const GPSLongitude = this.parseGpsData(exif.GPSLongitude);
            const { GPSLongitudeRef } = exif;
            const dec = dms2dec(GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef);
            console.log(dec);
          }
        },
      );
      console.log(updateProgress);
    },
    parseGpsData(data) {
      const aData = data.split(',');
      aData[0] = `${parseFloat(aData[0], 10)}/1`;
      aData[1] = `${parseFloat(aData[1], 10)}/1`;
      aData[2] = `${parseFloat(aData[2], 10)}/1`;
      return aData.join(',');
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
  // .padding
  //   padding-top: 15px;
  // .modal-content
  //   padding 20px
  //   h4
  //     -webkit-margin-before: 0
  //     -webkit-margin-after: 1
</style>
