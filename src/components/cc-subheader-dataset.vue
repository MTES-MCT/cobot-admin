<template>
  <div class="row subHeader">
    <div class="col-3">
      <div class="title row col items-center">
        <q-icon name="ballot" color="pink" size="32px"/>
        <span class="on-right">Jeu de donnée ({{ numItem }})</span>
      </div>
    </div>
    <div class="col-9" style="text-align: right; padding-top: 15px;">
      <q-btn @click="upldoadFromDropbox = true"
             default
             color="positive"
             style="margin-right: 10px;"
             icon="cloud_upload"
             label="Importer des photos depuis mon compte Dropbox" >
      </q-btn>
      <q-btn @click="exportData = true"
             default
             color="pink"
             style="margin-right: 10px;"
             icon="cloud_download"
             label="Exporter les données" >
      </q-btn>
      <!-- <q-btn @click="upldoadFromDesktop = true"
             color="positive"
             icon="important_devices"
             label="Importer depuis mon ordinateur"
             style="margin-right: 15px;" /> -->
    </div>
    <CcUploadFromDesktop :opened.sync="upldoadFromDesktop"></CcUploadFromDesktop>
    <CcUploadFromDropbox :opened.sync="upldoadFromDropbox"></CcUploadFromDropbox>
    <CcExportData :opened.sync="exportData"></CcExportData>
  </div>
</template>

<script>
import CcUploadFromDesktop from 'components/cc-upload-from-desktop';
import CcUploadFromDropbox from 'components/cc-upload-from-dropbox';
import CcExportData from 'components/cc-export-data';

export default {
  name: 'CcSubHeaderDataset',
  props: ['numItem'],
  components: {
    CcUploadFromDesktop,
    CcUploadFromDropbox,
    CcExportData,
  },
  data() {
    return {
      upldoadFromDesktop: false,
      upldoadFromDropbox: false,
      exportData: false,
    };
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .subHeader
    height 66px
    width 100%
    background-color #F0F0F0
    position: fixed
    position: fixed;
    z-index: 5900;
    box-shadow: 0 0 0 2px #F0F0F0, 0 5px 5px -4px rgba(0,0,0,0.75);
    .title
      font-weight 600
      padding-top 18px
      padding-left 10px


</style>
