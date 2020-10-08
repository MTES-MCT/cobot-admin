<template>
  <q-modal v-model="opened" class="exportData">
    <q-modal-layout>
      <q-toolbar color="dark" slot="header">
        <q-toolbar-title>
          Exporter les données
        </q-toolbar-title>
      </q-toolbar>
      <div v-if="!exported" class="layout-padding">
        <p style="font-weight: bold;">Merci de sélectionner les données à exporter</p>
        <!-- <q-field>
          <q-option-group
            type="radio"
            color="pink"
            @input="unSelectOptionWithLabel"
            v-model="exportMode"
            :options="options"
          />
        </q-field> -->
        <q-field style="padding-top: 10px;">
          <q-option-group
            type="checkbox"
            color="pink"
            @input="unSelectGeneralOption"
            v-model="exportModeLabel"
            :options="optionsWithLabel"
          />
          <!-- <q-toggle
            v-model="isGoogleVision"
            color="pink"
            label="Export data for Google Vision"
          /> -->
        </q-field>
      </div>
      <div v-if="exported" class="layout-padding" style="text-align: center;">
        <p>Le jeu de donnée a corectement été exporté ({{ numFile }} fichiers)</p>
      </div>
      <q-inner-loading :visible="isLoading">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
      <q-toolbar style="text-align: right;" color="white" slot="footer">
        <q-toolbar-title>
          <div class="padding" v-if="!exported">
            <q-btn @click="exportData()"
                   color="pink"
                   label="exporter pour entraîner l'IA" />
            <q-btn color="grey"
                   @click="close()"
                   label="annuler"
                   style="margin-left: 10px;" />
          </div>
          <div class="padding" v-if="exported">
            <q-btn @click="close()"
                   color="grey"
                   label="fermer"
                   style="margin-left: 10px;" />
          </div>
        </q-toolbar-title>
      </q-toolbar>
      <q-inner-loading class="spinner" :visible="isLoading">
        <q-spinner-gears size="50px" color="pink" />
      </q-inner-loading>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import { Loading, QSpinnerGears } from 'quasar';

import { DATASET_NUM_LABEL_QUERY, DATASET_EXPORT_TO_AUTOML } from '../constants/graphql';
import Labels from '../constants/labels';

export default {
  name: 'CcExportData',
  props: ['opened'],
  components: {
    Loading,
    QSpinnerGears,
  },
  computed: {
    ...mapState('dataset', ['dataset']),
    ...mapState('project', ['project']),
  },
  data() {
    return {
      isLoading: false,
      isGoogleVision: false,
      exported: false,
      numFile: null,
      options: [
        {
          label: 'Toutes les données',
          value: 'all',
        },
        {
          label: 'Uniquement les données qualifiées',
          value: 'all-answered',
        },
      ],
      optionsWithLabel: [],
      exportMode: null,
      exportModeLabel: [],
    };
  },
  mounted() {
    _.each(Labels, async (label) => {
      if (label.id !== 'none') {
        const num = await this.$apollo.query({
          query: DATASET_NUM_LABEL_QUERY,
          variables: {
            projectId: this.project.id,
            label: label.id,
          },
        });
        this.optionsWithLabel.push({
          value: label.id,
          label: `${label.label} (${num.data.DataSetNumLabel})`,
        });
      }
    });
  },
  methods: {
    async exportData() {
      // this.isLoading = true;
      this.$apollo.query({
        query: DATASET_EXPORT_TO_AUTOML,
        variables: {
          projectId: this.project.id,
          label: this.exportModeLabel.join(','),
        },
      });
      this.close();
      // const criteria = (this.exportMode) ? this.exportData : this.exportModeLabel.join(',');
      // const query =
      // `projectId=${this.project.id}&criteria=${criteria}&isGoogleVision=${this.isGoogleVision}`;
      // const exportData = await this.axios.request({
      //   url: `/export?${query}`,
      //   method: 'GET',
      //   responseType: 'blob',
      // });

      // const url = window.URL.createObjectURL(new Blob([exportData.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'extract.zip');
      // document.body.appendChild(link);
      // link.click();

      // this.isLoading = false;
    },
    unSelectOptionWithLabel() {
      this.exportModeLabel = [];
    },
    unSelectGeneralOption() {
      this.exportMode = null;
    },
    close() {
      this.isLoading = false;
      this.exportModeLabel = [];
      this.exportMode = null;
      this.$root.$emit('update:exported');
      this.$emit('update:opened', false);
    },
  },
};
</script>

<style scopped lang="stylus">
  .exportData
    .q-modal-layout
      width 60vw
      .q-field-label-inner
        color #000
</style>
