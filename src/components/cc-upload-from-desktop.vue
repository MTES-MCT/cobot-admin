<template>
  <q-modal v-model="opened">
    <h4>Importer un jeu de donnée</h4>
    <!-- :upload-factory="uploadFile" -->
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
      aData[0] = `${parseInt(aData[0], 10)}/1`;
      aData[1] = `${parseInt(aData[1], 10)}/1`;
      const second = aData[2].split('.');
      aData[2] = `${parseInt(second[0], 10)}/${parseInt(second[1], 10)}`;
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
  .padding
    padding-top: 15px;
  .modal-content
    padding 20px
    h4
      -webkit-margin-before: 0
      -webkit-margin-after: 1
</style>
